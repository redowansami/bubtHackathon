const express = require('express');
const { body } = require('express-validator');
const UserProfileController = require('../controllers/UserProfileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/profile
 * Get user profile (protected)
 */
router.get('/', UserProfileController.getProfile);

/**
 * PUT /api/v1/profile
 * Update user profile (protected)
 */
router.put(
  '/',
  [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Full name must be at least 3 characters'),
    body('householdSize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Household size must be at least 1'),
    body('dietaryPreferences')
      .optional()
      .isIn([
        'vegetarian',
        'vegan',
        'non-vegetarian',
        'low-carb',
        'gluten-free',
        'dairy-free',
        'no-preference',
      ])
      .withMessage('Invalid dietary preference'),
    body('location')
      .optional()
      .trim(),
    body('budget')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Budget cannot be negative'),
  ],
  UserProfileController.updateProfile
);

module.exports = router;
