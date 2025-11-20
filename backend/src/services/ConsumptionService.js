const ConsumptionRepository = require('../repositories/ConsumptionRepository');
const { MESSAGES } = require('../config/constants');

class ConsumptionService {
  /**
   * Log consumption item
   */
  async logConsumption(userId, consumptionData) {
    try {
      const log = await ConsumptionRepository.create({
        userId,
        itemName: consumptionData.itemName,
        category: consumptionData.category,
        quantity: consumptionData.quantity,
        date: consumptionData.date || new Date(),
        notes: consumptionData.notes || '',
      });

      return {
        success: true,
        message: 'Consumption logged',
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
        data: result,
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

      await ConsumptionRepository.deleteById(logId);

      return {
        success: true,
        message: 'Log deleted',
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
