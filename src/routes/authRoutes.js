const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 3 })
      .withMessage('Full name must be at least 3 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
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
  AuthController.register
);

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  AuthController.login
);

module.exports = router;
