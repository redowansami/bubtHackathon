const Inventory = require('../models/Inventory');

class InventoryRepository {
  /**
   * Create new inventory item
   */
  async create(inventoryData) {
    const inventory = new Inventory(inventoryData);
    return await inventory.save();
  }

  /**
   * Find inventory item by ID
   */
  async findById(itemId) {
    return await Inventory.findById(itemId);
  }

  /**
   * Get all inventory items for a user
   */
  async findByUserId(userId) {
    return await Inventory.find({ userId }).sort({ expiryDate: 1 });
  }

  /**
   * Get inventory items expiring soon
   */
  async findExpiringItems(userId, daysThreshold = 3) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

    return await Inventory.find({
      userId,
      expiryDate: { $gte: now, $lte: futureDate },
    }).sort({ expiryDate: 1 });
  }

  /**
   * Get inventory items by category
   */
  async findByCategory(userId, category) {
    return await Inventory.find({ userId, category }).sort({ expiryDate: 1 });
  }

  /**
   * Update inventory item
   */
  async updateById(itemId, updateData) {
    return await Inventory.findByIdAndUpdate(itemId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete inventory item
   */
  async deleteById(itemId) {
    return await Inventory.findByIdAndDelete(itemId);
  }

  /**
   * Delete all inventory items for a user
   */
  async deleteByUserId(userId) {
    return await Inventory.deleteMany({ userId });
  }

  /**
   * Get inventory summary
   */
  async getSummary(userId) {
    const mongoose = require('mongoose');
    return await Inventory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalCost: { $sum: { $multiply: ['$quantity', '$costPerUnit'] } },
        },
      },
    ]);
  }
}

module.exports = new InventoryRepository();
