const DashboardService = require('../services/DashboardService');
const { MESSAGES } = require('../config/constants');

class DashboardController {
  /**
   * Get dashboard
   */
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      const result = await DashboardService.getDashboard(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Dashboard Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get quick stats
   */
  async getQuickStats(req, res) {
    try {
      const userId = req.user.id;

      const result = await DashboardService.getQuickStats(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Quick Stats Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get analytics
   */
  async getAnalytics(req, res) {
    try {
      const userId = req.user.id;

      const result = await DashboardService.getAnalytics(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Analytics Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }
}

module.exports = new DashboardController();
