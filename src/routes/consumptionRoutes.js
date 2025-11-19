const express = require('express');
const { body } = require('express-validator');
const ConsumptionController = require('../controllers/ConsumptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

const categories = [
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
  'Other',
];

/**
 * POST /api/v1/consumption
 * Log consumption
 */
router.post(
  '/',
  [
    body('itemName')
      .trim()
      .notEmpty()
      .withMessage('Item name is required')
      .isLength({ min: 2 })
      .withMessage('Item name must be at least 2 characters'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(categories)
      .withMessage('Invalid category'),
    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    body('notes')
      .optional()
      .trim(),
  ],
  ConsumptionController.logConsumption
);

/**
 * GET /api/v1/consumption/history
 * Get consumption history
 */
router.get('/history', ConsumptionController.getHistory);

/**
 * GET /api/v1/consumption/recent
 * Get recent consumption logs
 */
router.get('/recent', ConsumptionController.getRecent);

/**
 * GET /api/v1/consumption/range
 * Get consumption by date range
 */
router.get('/range', ConsumptionController.getByDateRange);

/**
 * GET /api/v1/consumption/summary
 * Get consumption summary
 */
router.get('/summary', ConsumptionController.getSummary);

/**
 * PUT /api/v1/consumption/:logId
 * Update consumption log
 */
router.put(
  '/:logId',
  [
    body('itemName')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Item name must be at least 2 characters'),
    body('category')
      .optional()
      .isIn(categories)
      .withMessage('Invalid category'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    body('notes')
      .optional()
      .trim(),
  ],
  ConsumptionController.updateLog
);

/**
 * DELETE /api/v1/consumption/:logId
 * Delete consumption log
 */
router.delete('/:logId', ConsumptionController.deleteLog);

module.exports = router;
