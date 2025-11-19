const ResourceService = require('../services/ResourceService');
const { validationResult } = require('express-validator');
const { MESSAGES, HTTP_BAD_REQUEST } = require('../config/constants');

class ResourceController {
  /**
   * Create new resource
   */
  async createResource(req, res) {
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

      const { title, description, category, type, content, tags, imageUrl } = req.body;

      const result = await ResourceService.createResource({
        title,
        description,
        category,
        type,
        content,
        tags,
        imageUrl,
      });

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Create Resource Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get all resources
   */
  async getAllResources(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await ResourceService.getAllResources(parseInt(page), parseInt(limit));

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get All Resources Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get resources by category
   */
  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await ResourceService.getByCategory(
        category,
        parseInt(page),
        parseInt(limit)
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get By Category Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get resources by type
   */
  async getByType(req, res) {
    try {
      const { type } = req.query;

      if (!type) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: 'Type is required',
        });
      }

      const result = await ResourceService.getByType(type);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get By Type Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get resource by ID
   */
  async getResourceById(req, res) {
    try {
      const { resourceId } = req.params;

      const result = await ResourceService.getResourceById(resourceId);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Resource By ID Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get most viewed resources
   */
  async getMostViewed(req, res) {
    try {
      const { limit = 5 } = req.query;

      const result = await ResourceService.getMostViewed(parseInt(limit));

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Most Viewed Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Search resources
   */
  async search(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: 'Query is required',
        });
      }

      const result = await ResourceService.search(query);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Search Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }

  /**
   * Get recommended resources based on category
   */
  async getRecommendations(req, res) {
    try {
      const { category } = req.query;

      if (!category) {
        return res.status(HTTP_BAD_REQUEST).json({
          success: false,
          message: 'Category is required',
        });
      }

      const result = await ResourceService.getRecommendations(category);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
      });
    } catch (error) {
      console.error('Get Recommendations Error:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  }
}

module.exports = new ResourceController();
