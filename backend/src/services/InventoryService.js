const InventoryRepository = require('../repositories/InventoryRepository');
const { MESSAGES } = require('../config/constants');

class InventoryService {
  /**
   * Add new inventory item
   */
  async addItem(userId, itemData) {
    try {
      const inventory = await InventoryRepository.create({
        userId,
        itemName: itemData.itemName,
        category: itemData.category,
        quantity: itemData.quantity,
        expirationDays: itemData.expirationDays,
        expiryDate: itemData.expiryDate,
        costPerUnit: itemData.costPerUnit,
      });

      return {
        success: true,
        message: 'Item added to inventory',
        statusCode: 201,
        data: inventory,
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
   * Get all inventory items
   */
  async getInventory(userId) {
    try {
      const items = await InventoryRepository.findByUserId(userId);

      return {
        success: true,
        message: 'Inventory retrieved',
        statusCode: 200,
        data: items,
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
   * Get items expiring soon
   */
  async getExpiringItems(userId, daysThreshold = 3) {
    try {
      const items = await InventoryRepository.findExpiringItems(userId, daysThreshold);

      return {
        success: true,
        message: 'Expiring items retrieved',
        statusCode: 200,
        data: items,
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
   * Get items by category
   */
  async getItemsByCategory(userId, category) {
    try {
      const items = await InventoryRepository.findByCategory(userId, category);

      return {
        success: true,
        message: 'Items retrieved',
        statusCode: 200,
        data: items,
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
   * Update inventory item
   */
  async updateItem(userId, itemId, updateData) {
    try {
      const item = await InventoryRepository.findById(itemId);

      if (!item || item.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Item not found',
          statusCode: 404,
        };
      }

      const updatedItem = await InventoryRepository.updateById(itemId, updateData);

      return {
        success: true,
        message: 'Item updated',
        statusCode: 200,
        data: updatedItem,
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
   * Delete inventory item
   */
  async deleteItem(userId, itemId) {
    try {
      const item = await InventoryRepository.findById(itemId);

      if (!item || item.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Item not found',
          statusCode: 404,
        };
      }

      await InventoryRepository.deleteById(itemId);

      return {
        success: true,
        message: 'Item deleted',
        statusCode: 200,
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
   * Get inventory summary
   */
  async getSummary(userId) {
    try {
      const summary = await InventoryRepository.getSummary(userId);

      return {
        success: true,
        message: 'Summary retrieved',
        statusCode: 200,
        data: summary,
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

module.exports = new InventoryService();
