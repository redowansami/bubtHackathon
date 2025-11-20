const User = require('../models/User');

class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    return await User.findById(userId).select('-password');
  }

  /**
   * Create new user
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Update user by ID
   */
  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  /**
   * Get user by email with password (for login)
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Check if user exists
   */
  async exists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  /**
   * Get all users (admin only)
   */
  async getAll() {
    return await User.find().select('-password');
  }

  /**
   * Delete user by ID
   */
  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();
