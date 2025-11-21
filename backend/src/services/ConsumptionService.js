const ConsumptionRepository = require('../repositories/ConsumptionRepository');
const InventoryRepository = require('../repositories/InventoryRepository');
const { MESSAGES } = require('../config/constants');

class ConsumptionService {
  /**
   * Log consumption item
   */
  async logConsumption(userId, consumptionData) {
    try {
      const { inventoryItemId, quantity, itemName, category, date, notes } = consumptionData;

      // Check if inventory item exists and belongs to the user
      const inventoryItem = await InventoryRepository.findById(inventoryItemId);

      if (!inventoryItem || inventoryItem.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Inventory item not found',
          statusCode: 404,
        };
      }

      // Validate that quantity doesn't exceed available inventory
      if (quantity > inventoryItem.quantity) {
        return {
          success: false,
          message: `Insufficient quantity. Available: ${inventoryItem.quantity}, Requested: ${quantity}`,
          statusCode: 400,
        };
      }

      // Create consumption log
      const log = await ConsumptionRepository.create({
        userId,
        inventoryItemId,
        itemName,
        category,
        quantity,
        date: date || new Date(),
        notes: notes || '',
      });

      // Decrease inventory quantity
      const newQuantity = inventoryItem.quantity - quantity;
      
      // Delete item if quantity reaches zero, otherwise update
      if (newQuantity === 0) {
        await InventoryRepository.deleteById(inventoryItemId);
      } else {
        await InventoryRepository.updateById(inventoryItemId, { quantity: newQuantity });
      }

      return {
        success: true,
        message: 'Consumption logged successfully',
        statusCode: 201,
        data: log,
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
   * Get consumption history
   */
  async getHistory(userId, page = 1, limit = 10) {
    try {
      const result = await ConsumptionRepository.getHistory(userId, page, limit);

      return {
        success: true,
        message: 'History retrieved',
        statusCode: 200,
        data: result.logs, // Return just the logs array
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
   * Get consumption for date range
   */
  async getByDateRange(userId, startDate, endDate) {
    try {
      const logs = await ConsumptionRepository.findByDateRange(userId, startDate, endDate);

      return {
        success: true,
        message: 'Logs retrieved',
        statusCode: 200,
        data: logs,
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
   * Get recent consumption logs
   */
  async getRecent(userId, limit = 5) {
    try {
      const logs = await ConsumptionRepository.getRecent(userId, limit);

      return {
        success: true,
        message: 'Recent logs retrieved',
        statusCode: 200,
        data: logs,
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
   * Get consumption summary
   */
  async getSummary(userId) {
    try {
      const summary = await ConsumptionRepository.getSummary(userId);

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

  /**
   * Update consumption log
   */
  async updateLog(userId, logId, updateData) {
    try {
      const log = await ConsumptionRepository.findById(logId);

      if (!log || log.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Log not found',
          statusCode: 404,
        };
      }

      const inventoryItem = await InventoryRepository.findById(log.inventoryItemId);
      if (!inventoryItem) {
        return {
          success: false,
          message: 'Associated inventory item not found',
          statusCode: 404,
        };
      }

      // If quantity is being updated, validate and adjust inventory
      if (updateData.quantity && updateData.quantity !== log.quantity) {
        const quantityDifference = updateData.quantity - log.quantity;

        // Check if there's enough inventory to increase consumption
        if (quantityDifference > 0 && quantityDifference > inventoryItem.quantity) {
          return {
            success: false,
            message: `Insufficient quantity to update. Available: ${inventoryItem.quantity}, Additional needed: ${quantityDifference}`,
            statusCode: 400,
          };
        }

        // Adjust inventory
        const newQuantity = inventoryItem.quantity - quantityDifference;
        
        // Delete item if quantity reaches zero, otherwise update
        if (newQuantity === 0) {
          await InventoryRepository.deleteById(log.inventoryItemId);
        } else {
          await InventoryRepository.updateById(log.inventoryItemId, { quantity: newQuantity });
        }
      }

      const updatedLog = await ConsumptionRepository.updateById(logId, updateData);

      return {
        success: true,
        message: 'Log updated',
        statusCode: 200,
        data: updatedLog,
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
   * Delete consumption log
   */
  async deleteLog(userId, logId) {
    try {
      const log = await ConsumptionRepository.findById(logId);

      if (!log || log.userId.toString() !== userId) {
        return {
          success: false,
          message: 'Log not found',
          statusCode: 404,
        };
      }

      const inventoryItem = await InventoryRepository.findById(log.inventoryItemId);
      if (inventoryItem) {
        // Restore inventory quantity when log is deleted
        const restoredQuantity = inventoryItem.quantity + log.quantity;
        await InventoryRepository.updateById(log.inventoryItemId, { quantity: restoredQuantity });
      }

      await ConsumptionRepository.deleteById(logId);

      return {
        success: true,
        message: 'Log deleted and inventory restored',
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
}

module.exports = new ConsumptionService();
