const Upload = require('../models/Upload');

class UploadRepository {
  /**
   * Create new upload record
   */
  async create(uploadData) {
    const upload = new Upload(uploadData);
    return await upload.save();
  }

  /**
   * Find upload by ID
   */
  async findById(uploadId) {
    return await Upload.findById(uploadId);
  }

  /**
   * Get all uploads for a user
   */
  async findByUserId(userId) {
    return await Upload.find({ userId }).sort({ uploadedAt: -1 });
  }

  /**
   * Get uploads by associated type
   */
  async findByAssociatedType(userId, associatedType) {
    return await Upload.find({ userId, associatedType }).sort({ uploadedAt: -1 });
  }

  /**
   * Get uploads by associated ID
   */
  async findByAssociatedId(associatedId) {
    return await Upload.find({ associatedId }).sort({ uploadedAt: -1 });
  }

  /**
   * Update upload record
   */
  async updateById(uploadId, updateData) {
    return await Upload.findByIdAndUpdate(uploadId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete upload record
   */
  async deleteById(uploadId) {
    return await Upload.findByIdAndDelete(uploadId);
  }

  /**
   * Delete all uploads for a user
   */
  async deleteByUserId(userId) {
    return await Upload.deleteMany({ userId });
  }

  /**
   * Get recent uploads for user
   */
  async getRecent(userId, limit = 10) {
    return await Upload.find({ userId }).sort({ uploadedAt: -1 }).limit(limit);
  }

  /**
   * Get upload count by type
   */
  async getCountByType(userId) {
    return await Upload.aggregate([
      { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$associatedType',
          count: { $sum: 1 },
        },
      },
    ]);
  }
}

module.exports = new UploadRepository();
