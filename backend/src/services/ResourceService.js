const ResourceRepository = require('../repositories/ResourceRepository');
const { MESSAGES } = require('../config/constants');

class ResourceService {
  /**
   * Create new resource
   */
  async createResource(resourceData) {
    try {
      const resource = await ResourceRepository.create({
        title: resourceData.title,
        description: resourceData.description,
        category: resourceData.category,
        type: resourceData.type,
        content: resourceData.content,
        tags: resourceData.tags || [],
        imageUrl: resourceData.imageUrl,
        views: 0,
      });

      return {
        success: true,
        message: 'Resource created successfully',
        statusCode: 201,
        data: resource,
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
   * Get all resources (with pagination)
   */
  async getAllResources(page = 1, limit = 10) {
    try {
      const result = await ResourceRepository.findWithPagination(page, limit);

      return {
        success: true,
        message: 'Resources retrieved',
        statusCode: 200,
        data: result.resources, // Return just the resources array
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
   * Get resources by category
   */
  async getByCategory(category, page = 1, limit = 10) {
    try {
      const result = await ResourceRepository.findByCategoryWithPagination(
        category,
        page,
        limit
      );

      return {
        success: true,
        message: 'Resources retrieved',
        statusCode: 200,
        data: result.resources, // Return just the resources array
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
   * Get resources by type
   */
  async getByType(type) {
    try {
      const resources = await ResourceRepository.findByType(type);

      return {
        success: true,
        message: 'Resources retrieved',
        statusCode: 200,
        data: resources,
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
   * Get resource by ID (increment views)
   */
  async getResourceById(resourceId) {
    try {
      const resource = await ResourceRepository.findById(resourceId);

      if (!resource) {
        return {
          success: false,
          message: 'Resource not found',
          statusCode: 404,
        };
      }

      // Increment views
      await ResourceRepository.incrementViews(resourceId);

      return {
        success: true,
        message: 'Resource retrieved',
        statusCode: 200,
        data: resource,
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
   * Get most viewed resources
   */
  async getMostViewed(limit = 5) {
    try {
      const resources = await ResourceRepository.getMostViewed(limit);

      return {
        success: true,
        message: 'Most viewed resources retrieved',
        statusCode: 200,
        data: resources,
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
   * Search resources
   */
  async search(query) {
    try {
      const resources = await ResourceRepository.search(query);

      return {
        success: true,
        message: 'Search results',
        statusCode: 200,
        data: resources,
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
   * Get recommended resources based on category
   */
  async getRecommendations(category) {
    try {
      const resources = await ResourceRepository.findByCategory(category);

      return {
        success: true,
        message: 'Recommendations retrieved',
        statusCode: 200,
        data: resources,
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

module.exports = new ResourceService();
