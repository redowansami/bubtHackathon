const ConsumptionService = require('../services/ConsumptionService');
const { validationResult } = require('express-validator');
const { MESSAGES, HTTP_BAD_REQUEST } = require('../config/constants');

class ConsumptionController {
  /**
   * Log consumption
   */
  async logConsumption(req, res) {
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
      const result = await ConsumptionService.logConsumption(userId, req.body);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Log Consumption Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get consumption history
   */
  async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const result = await ConsumptionService.getHistory(userId, parseInt(page), parseInt(limit));

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get History Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get consumption by date range
   */
  async getByDateRange(req, res) {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: 'startDate and endDate are required',
        });
      }

      const result = await ConsumptionService.getByDateRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get By Date Range Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get recent consumption logs
   */
  async getRecent(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 5 } = req.query;

      const result = await ConsumptionService.getRecent(userId, parseInt(limit));

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Recent Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get consumption summary
   */
  async getSummary(req, res) {
    try {
      const userId = req.user.id;
      const result = await ConsumptionService.getSummary(userId);

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

  /**
   * Update consumption log
   */
  async updateLog(req, res) {
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
      const { logId } = req.params;

      const result = await ConsumptionService.updateLog(userId, logId, req.body);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Update Log Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Delete consumption log
   */
  async deleteLog(req, res) {
    try {
      const userId = req.user.id;
      const { logId } = req.params;

      const result = await ConsumptionService.deleteLog(userId, logId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error('Delete Log Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }
}

module.exports = new ConsumptionController();
