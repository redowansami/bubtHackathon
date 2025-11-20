const InventoryService = require('../services/InventoryService');
const { validationResult } = require('express-validator');
const { MESSAGES, HTTP_BAD_REQUEST } = require('../config/constants');

class InventoryController {
  /**
   * Add new inventory item
   */
  async addItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const result = await InventoryService.addItem(userId, req.body);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Add Item Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get all inventory items
   */
  async getInventory(req, res) {
    try {
      const userId = req.user.id;
      const result = await InventoryService.getInventory(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Inventory Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get expiring items
   */
  async getExpiringItems(req, res) {
    try {
      const userId = req.user.id;
      const { daysThreshold } = req.query;

      const result = await InventoryService.getExpiringItems(
        userId,
        parseInt(daysThreshold) || 3
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Expiring Items Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get items by category
   */
  async getByCategory(req, res) {
    try {
      const userId = req.user.id;
      const { category } = req.query;

      if (!category) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: 'Category is required',
        });
      }

      const result = await InventoryService.getItemsByCategory(userId, category);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get By Category Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Update inventory item
   */
  async updateItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const { itemId } = req.params;

      const result = await InventoryService.updateItem(userId, itemId, req.body);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Update Item Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Delete inventory item
   */
  async deleteItem(req, res) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;

      const result = await InventoryService.deleteItem(userId, itemId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error('Delete Item Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get inventory summary
   */
  async getSummary(req, res) {
    try {
      const userId = req.user.id;
      const result = await InventoryService.getSummary(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Summary Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }
}

module.exports = new InventoryController();
