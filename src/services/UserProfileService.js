const UserRepository = require('../repositories/UserRepository');
const { MESSAGES, HTTP_NOT_FOUND } = require('../config/constants');

class UserProfileService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          message: MESSAGES.PROFILE_FETCHED,
          statusCode: HTTP_NOT_FOUND,
        };
      }

      return {
        success: true,
        message: MESSAGES.PROFILE_FETCHED,
        statusCode: 200,
        data: user,
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
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    try {
      const user = await UserRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          statusCode: HTTP_NOT_FOUND,
        };
      }

      // Only allow specific fields to be updated
      const allowedFields = [
        'fullName',
        'householdSize',
        'dietaryPreferences',
        'location',
        'budget',
        'profileImage',
      ];

      const filteredData = {};
      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      const updatedUser = await UserRepository.updateById(userId, filteredData);

      return {
        success: true,
        message: MESSAGES.PROFILE_UPDATED,
        statusCode: 200,
        data: updatedUser,
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

module.exports = new UserProfileService();
