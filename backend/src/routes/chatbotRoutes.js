const express = require('express');
const ChatbotController = require('../controllers/ChatbotController');

const router = express.Router();

/**
 * General Q&A (stateless)
 * POST /api/v1/chatbot/ask
 */
router.post('/ask', (req, res) => ChatbotController.ask(req, res));

/**
 * Food Waste Reduction Advice (stateful with session memory)
 * POST /api/v1/chatbot/waste-reduction
 * Body: { content: string, sessionId?: string }
 */
router.post('/waste-reduction', (req, res) => ChatbotController.wasteReductionAdvice(req, res));

/**
 * Nutrition Balancing Advice (stateful with session memory)
 * POST /api/v1/chatbot/nutrition
 * Body: { content: string, sessionId?: string }
 */
router.post('/nutrition', (req, res) => ChatbotController.nutritionAdvice(req, res));

/**
 * Budget Meal Planning (stateful with session memory)
 * POST /api/v1/chatbot/budget-meals
 * Body: { content: string, sessionId?: string, context?: { budget, familySize, etc } }
 */
router.post('/budget-meals', (req, res) => ChatbotController.budgetMealPlan(req, res));

/**
 * Leftover Transformation Ideas (stateful with session memory)
 * POST /api/v1/chatbot/leftovers
 * Body: { content: string, sessionId?: string }
 */
router.post('/leftovers', (req, res) => ChatbotController.leftoverIdeas(req, res));

/**
 * Food Sharing & Community Resources (stateful with session memory)
 * POST /api/v1/chatbot/food-sharing
 * Body: { content: string, sessionId?: string }
 */
router.post('/food-sharing', (req, res) => ChatbotController.foodSharingAdvice(req, res));

/**
 * Environmental Impact Explanation (stateful with session memory)
 * POST /api/v1/chatbot/environment
 * Body: { content: string, sessionId?: string }
 */
router.post('/environment', (req, res) => ChatbotController.environmentalImpact(req, res));

/**
 * General Food Advice (stateful with session memory and context)
 * POST /api/v1/chatbot/advice
 * Body: { content: string, sessionId?: string, context?: {} }
 */
router.post('/advice', (req, res) => ChatbotController.generalAdvice(req, res));

/**
 * Get Session History (for prompt chaining)
 * GET /api/v1/chatbot/sessions/:sessionId/history
 */
router.get('/sessions/:sessionId/history', (req, res) => ChatbotController.getSessionHistory(req, res));

/**
 * Get Session Context
 * GET /api/v1/chatbot/sessions/:sessionId/context
 */
router.get('/sessions/:sessionId/context', (req, res) => ChatbotController.getSessionContext(req, res));

/**
 * Clear Session
 * DELETE /api/v1/chatbot/sessions/:sessionId
 */
router.delete('/sessions/:sessionId', (req, res) => ChatbotController.clearSession(req, res));

module.exports = router;
