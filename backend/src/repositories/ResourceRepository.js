const Resource = require('../models/Resource');

class ResourceRepository {
  /**
   * Create new resource (admin only)
   */
  async create(resourceData) {
    const resource = new Resource(resourceData);
    return await resource.save();
  }

  /**
   * Find resource by ID
   */
  async findById(resourceId) {
    return await Resource.findById(resourceId);
  }

  /**
   * Get all active resources
   */
  async findAll() {
    return await Resource.find({ isActive: true }).sort({ createdAt: -1 });
  }

  /**
   * Get resources by category
   */
  async findByCategory(category) {
    return await Resource.find({ category, isActive: true }).sort({ createdAt: -1 });
  }

  /**
   * Get resources by type
   */
  async findByType(type) {
    return await Resource.find({ type, isActive: true }).sort({ createdAt: -1 });
  }

  /**
   * Get resources with pagination
   */
  async findWithPagination(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const resources = await Resource.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments({ isActive: true });

    return {
      resources,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get resources by category with pagination
   */
  async findByCategoryWithPagination(category, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const resources = await Resource.find({ category, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments({ category, isActive: true });

    return {
      resources,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update resource (admin only)
   */
  async updateById(resourceId, updateData) {
    return await Resource.findByIdAndUpdate(resourceId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Increment view count
   */
  async incrementViews(resourceId) {
    return await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  /**
   * Delete resource (admin only)
   */
  async deleteById(resourceId) {
    return await Resource.findByIdAndDelete(resourceId);
  }

  /**
   * Get most viewed resources
   */
  async getMostViewed(limit = 5) {
    return await Resource.find({ isActive: true }).sort({ views: -1 }).limit(limit);
  }

  /**
   * Search resources by title or description
   */
  async search(query) {
    return await Resource.find({
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
  }

  /**
   * Get resources by multiple categories
   */
  async findByCategories(categories, limit = 5) {
    return await Resource.find({
      category: { $in: categories },
      isActive: true,
    })
      .sort({ views: -1 })
      .limit(limit);
  }
}

module.exports = new ResourceRepository();
