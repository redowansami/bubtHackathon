const UserProfileService = require('../services/UserProfileService');
const { validationResult } = require('express-validator');
const { MESSAGES, HTTP_BAD_REQUEST } = require('../config/constants');

class UserProfileController {
  /**
   * Get user profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const result = await UserProfileService.getProfile(userId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Profile Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const updateData = req.body;

      const result = await UserProfileService.updateProfile(userId, updateData);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Update Profile Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }
}

module.exports = new UserProfileController();
