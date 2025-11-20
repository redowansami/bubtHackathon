const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/dashboard
 * Get complete dashboard with all data
 */
router.get('/', DashboardController.getDashboard);

/**
 * GET /api/v1/dashboard/quick-stats
 * Get quick statistics
 */
router.get('/quick-stats', DashboardController.getQuickStats);

/**
 * GET /api/v1/dashboard/analytics
 * Get analytics data
 */
router.get('/analytics', DashboardController.getAnalytics);

module.exports = router;
