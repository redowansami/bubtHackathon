const UserRepository = require('../repositories/UserRepository');
const InventoryRepository = require('../repositories/InventoryRepository');
const ConsumptionRepository = require('../repositories/ConsumptionRepository');
const ResourceRepository = require('../repositories/ResourceRepository');
const { MESSAGES } = require('../config/constants');

class DashboardService {
  /**
   * Get complete dashboard data
   */
  async getDashboard(userId) {
    try {
      // Fetch all required data in parallel
      const [user, inventorySummary, consumptionSummary, recentConsumption, inventoryItems] =
        await Promise.all([
          UserRepository.findById(userId),
          InventoryRepository.getSummary(userId),
          ConsumptionRepository.getSummary(userId),
          ConsumptionRepository.getRecent(userId, 10),
          InventoryRepository.findByUserId(userId),
        ]);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      // Calculate inventory statistics
      const totalInventoryValue = inventoryItems.reduce((sum, item) => {
        return sum + item.quantity * item.costPerUnit;
      }, 0);

      const expiringItems = inventoryItems.filter((item) => {
        const daysUntilExpiry = Math.ceil(
          (item.expiryDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
      });

      // Get resources based on consumption categories
      const consumptionCategories = consumptionSummary.map((summary) => summary._id);
      let recommendedResources = [];

      if (consumptionCategories.length > 0) {
        recommendedResources = await ResourceRepository.findByCategories(consumptionCategories, 5);
      }

      // Calculate waste statistics
      const totalConsumed = consumptionSummary.reduce((sum, summary) => {
        return sum + summary.totalQuantity;
      }, 0);

      const totalInventory = inventoryItems.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);

      // Basic analytics
      const analytics = {
        totalInventoryItems: inventoryItems.length,
        expiringItemsCount: expiringItems.length,
        totalInventoryValue,
        totalConsumedQuantity: totalConsumed,
        totalInventoryQuantity: totalInventory,
        consumptionRate: totalInventory > 0 ? ((totalConsumed / (totalConsumed + totalInventory)) * 100).toFixed(2) : 0,
      };

      return {
        success: true,
        message: 'Dashboard data fetched successfully',
        statusCode: 200,
        data: {
          user: {
            fullName: user.fullName,
            email: user.email,
            householdSize: user.householdSize,
            dietaryPreferences: user.dietaryPreferences,
            location: user.location,
            budget: user.budget,
          },
          inventory: {
            summary: inventorySummary,
            totalItems: inventoryItems.length,
            totalValue: totalInventoryValue,
            expiringItems: expiringItems.map((item) => ({
              id: item._id,
              itemName: item.itemName,
              category: item.category,
              expiryDate: item.expiryDate,
              quantity: item.quantity,
            })),
          },
          consumption: {
            summary: consumptionSummary,
            recentLogs: recentConsumption.map((log) => ({
              id: log._id,
              itemName: log.itemName,
              category: log.category,
              quantity: log.quantity,
              date: log.date,
            })),
          },
          recommendedResources: recommendedResources.map((resource) => ({
            id: resource._id,
            title: resource.title,
            category: resource.category,
            type: resource.type,
          })),
          analytics,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Get quick stats
   */
  async getQuickStats(userId) {
    try {
      const [inventoryItems, recentConsumption, expiringItems] = await Promise.all([
        InventoryRepository.findByUserId(userId),
        ConsumptionRepository.getRecent(userId, 5),
        InventoryRepository.findExpiringItems(userId, 3),
      ]);

      return {
        success: true,
        message: 'Quick stats fetched successfully',
        statusCode: 200,
        data: {
          totalInventoryItems: inventoryItems.length,
          expiringItemsCount: expiringItems.length,
          recentConsumptionCount: recentConsumption.length,
          lastConsumptionDate: recentConsumption[0]?.date || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(userId) {
    try {
      const [inventoryItems, consumptionLogs] = await Promise.all([
        InventoryRepository.findByUserId(userId),
        ConsumptionRepository.findByUserId(userId),
      ]);

      const totalInventoryValue = inventoryItems.reduce((sum, item) => {
        return sum + item.quantity * item.costPerUnit;
      }, 0);

      const totalConsumedQuantity = consumptionLogs.reduce((sum, log) => {
        return sum + log.quantity;
      }, 0);

      const inventoryCategoryBreakdown = {};
      inventoryItems.forEach((item) => {
        if (!inventoryCategoryBreakdown[item.category]) {
          inventoryCategoryBreakdown[item.category] = {
            count: 0,
            quantity: 0,
            value: 0,
          };
        }
        inventoryCategoryBreakdown[item.category].count += 1;
        inventoryCategoryBreakdown[item.category].quantity += item.quantity;
        inventoryCategoryBreakdown[item.category].value += item.quantity * item.costPerUnit;
      });

      return {
        success: true,
        message: 'Analytics fetched successfully',
        statusCode: 200,
        data: {
          totalInventoryValue,
          totalConsumedQuantity,
          totalInventoryQuantity: inventoryItems.reduce((sum, item) => sum + item.quantity, 0),
          categoriesByValue: inventoryCategoryBreakdown,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || MESSAGES.ERROR,
        statusCode: 500,
      };
    }
  }
}

module.exports = new DashboardService();
