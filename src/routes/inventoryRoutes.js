const express = require('express');
const { body, query } = require('express-validator');
const InventoryController = require('../controllers/InventoryController');
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
 * POST /api/v1/inventory
 * Add new inventory item
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
    body('expirationDays')
      .notEmpty()
      .withMessage('Expiration days is required')
      .isInt({ min: 1 })
      .withMessage('Expiration days must be at least 1'),
    body('expiryDate')
      .notEmpty()
      .withMessage('Expiry date is required')
      .isISO8601()
      .withMessage('Invalid date format'),
    body('costPerUnit')
      .notEmpty()
      .withMessage('Cost per unit is required')
      .isFloat({ min: 0 })
      .withMessage('Cost must be a non-negative number'),
  ],
  InventoryController.addItem
);

/**
 * GET /api/v1/inventory
 * Get all inventory items
 */
router.get('/', InventoryController.getInventory);

/**
 * GET /api/v1/inventory/expiring
 * Get expiring items
 */
router.get('/expiring', InventoryController.getExpiringItems);

/**
 * GET /api/v1/inventory/category
 * Get items by category
 */
router.get('/category', InventoryController.getByCategory);

/**
 * GET /api/v1/inventory/summary
 * Get inventory summary
 */
router.get('/summary', InventoryController.getSummary);

/**
 * PUT /api/v1/inventory/:itemId
 * Update inventory item
 */
router.put(
  '/:itemId',
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
    body('expirationDays')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Expiration days must be at least 1'),
    body('expiryDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
    body('costPerUnit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Cost must be a non-negative number'),
  ],
  InventoryController.updateItem
);

/**
 * DELETE /api/v1/inventory/:itemId
 * Delete inventory item
 */
router.delete('/:itemId', InventoryController.deleteItem);

module.exports = router;
