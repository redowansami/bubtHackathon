const ConsumptionLog = require('../models/ConsumptionLog');

class ConsumptionRepository {
  /**
   * Create new consumption log
   */
  async create(consumptionData) {
    const log = new ConsumptionLog(consumptionData);
    return await log.save();
  }

  /**
   * Find consumption log by ID
   */
  async findById(logId) {
    return await ConsumptionLog.findById(logId);
  }

  /**
   * Get all consumption logs for a user
   */
  async findByUserId(userId) {
    return await ConsumptionLog.find({ userId }).sort({ date: -1 });
  }

  /**
   * Get consumption logs for a specific date range
   */
  async findByDateRange(userId, startDate, endDate) {
    return await ConsumptionLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });
  }

  /**
   * Get consumption logs by category
   */
  async findByCategory(userId, category) {
    return await ConsumptionLog.find({ userId, category }).sort({ date: -1 });
  }

  /**
   * Get consumption history with pagination
   */
  async getHistory(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const logs = await ConsumptionLog.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ConsumptionLog.countDocuments({ userId });

    return {
      logs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update consumption log
   */
  async updateById(logId, updateData) {
    return await ConsumptionLog.findByIdAndUpdate(logId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete consumption log
   */
  async deleteById(logId) {
    return await ConsumptionLog.findByIdAndDelete(logId);
  }

  /**
   * Get consumption summary
   */
  async getSummary(userId) {
    const mongoose = require('mongoose');
    return await ConsumptionLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
    ]);
  }

  /**
   * Get recent consumption logs
   */
  async getRecent(userId, limit = 5) {
    return await ConsumptionLog.find({ userId }).sort({ date: -1 }).limit(limit);
  }
}

module.exports = new ConsumptionRepository();
