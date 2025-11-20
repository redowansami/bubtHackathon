const UserRepository = require('../repositories/UserRepository');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { MESSAGES, HTTP_CONFLICT, HTTP_UNAUTHORIZED } = require('../config/constants');

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const userExists = await UserRepository.exists(userData.email);
      if (userExists) {
        return {
          success: false,
          message: MESSAGES.USER_EXISTS,
          statusCode: HTTP_CONFLICT,
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user
      const user = await UserRepository.create({
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        householdSize: userData.householdSize || 1,
        dietaryPreferences: userData.dietaryPreferences || 'no-preference',
        location: userData.location || '',
        budget: userData.budget || 0,
      });

      // Generate token
      const token = generateToken(user._id);

      return {
        success: true,
        message: MESSAGES.USER_CREATED,
        statusCode: 201,
        data: {
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            householdSize: user.householdSize,
            dietaryPreferences: user.dietaryPreferences,
            location: user.location,
            budget: user.budget,
          },
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
   * Login user
   */
  async login(email, password) {
    try {
      // Find user with password
      const user = await UserRepository.findByEmailWithPassword(email);

      if (!user) {
        return {
          success: false,
          message: MESSAGES.INVALID_CREDENTIALS,
          statusCode: HTTP_UNAUTHORIZED,
        };
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: MESSAGES.INVALID_CREDENTIALS,
          statusCode: HTTP_UNAUTHORIZED,
        };
      }

      // Generate token
      const token = generateToken(user._id);

      return {
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
        statusCode: 200,
        data: {
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            householdSize: user.householdSize,
            dietaryPreferences: user.dietaryPreferences,
            location: user.location,
            budget: user.budget,
          },
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

module.exports = new AuthService();
