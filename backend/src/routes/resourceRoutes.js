const express = require('express');
const { body } = require('express-validator');
const ResourceController = require('../controllers/ResourceController');
const router = express.Router();

/**
 * POST /api/v1/resources
 * Create new resource
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isIn([
        'Dairy',
        'Vegetables',
        'Fruits',
        'Grains',
        'Protein',
        'Bakery',
        'Beverages',
        'Condiments',
        'Frozen',
        'Snacks',
        'Storage',
        'Meal Planning',
        'Budget',
        'Waste Reduction',
        'Nutrition',
        'General',
      ])
      .withMessage('Invalid category'),
    body('type')
      .trim()
      .notEmpty()
      .withMessage('Type is required')
      .isIn(['article', 'tip', 'guide', 'recipe', 'infographic', 'video'])
      .withMessage('Invalid type'),
    body('content')
      .optional()
      .trim(),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
  ],
  ResourceController.createResource
);

/**
 * GET /api/v1/resources
 * Get all resources (public)
 */
router.get('/', ResourceController.getAllResources);

/**
 * GET /api/v1/resources/search
 * Search resources
 */
router.get('/search', ResourceController.search);

/**
 * GET /api/v1/resources/type/:type
 * Get resources by type
 */
router.get('/type/:type', ResourceController.getByType);

/**
 * GET /api/v1/resources/most-viewed
 * Get most viewed resources
 */
router.get('/most-viewed', ResourceController.getMostViewed);

/**
 * GET /api/v1/resources/recommend
 * Get recommended resources based on category
 */
router.get('/recommend', ResourceController.getRecommendations);

/**
 * GET /api/v1/resources/category/:category
 * Get resources by category
 */
router.get('/category/:category', ResourceController.getByCategory);

/**
 * GET /api/v1/resources/:resourceId
 * Get resource by ID
 */
router.get('/:resourceId', ResourceController.getResourceById);

module.exports = router;
