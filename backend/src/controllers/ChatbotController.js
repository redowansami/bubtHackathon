const ChatbotService = require('../services/ChatbotService');
const { v4: uuidv4 } = require('uuid');

class ChatbotController {
    async ask(req, res) {
        try {
            const { content, enableReasoning } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const response = await ChatbotService.askQuestion(content, enableReasoning);

            return res.status(200).json({
                success: true,
                data: {
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async wasteReductionAdvice(req, res) {
        try {
            const { content, sessionId } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();
            const response = await ChatbotService.getWasteReductionAdvice(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async nutritionAdvice(req, res) {
        try {
            const { content, sessionId } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();
            const response = await ChatbotService.getNutritionAdvice(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async budgetMealPlan(req, res) {
        try {
            const { content, sessionId, context } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();

            if (context) {
                ChatbotService.setSessionContext(session, context);
            }

            const response = await ChatbotService.getBudgetMealPlan(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async leftoverIdeas(req, res) {
        try {
            const { content, sessionId } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();
            const response = await ChatbotService.getLeftoverIdeas(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async foodSharingAdvice(req, res) {
        try {
            const { content, sessionId } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();
            const response = await ChatbotService.getFoodSharingAdvice(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async environmentalImpact(req, res) {
        try {
            const { content, sessionId } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();
            const response = await ChatbotService.getEnvironmentalImpact(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async generalAdvice(req, res) {
        try {
            const { content, sessionId, context } = req.body;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const session = sessionId || uuidv4();

            if (context) {
                ChatbotService.setSessionContext(session, context);
            }

            const response = await ChatbotService.getGeneralAdvice(session, content);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId: response.sessionId,
                    answer: response.content,
                    reasoning: response.reasoning_details,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getSessionHistory(req, res) {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID is required',
                });
            }

            const history = ChatbotService.getSessionHistory(sessionId);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId,
                    history,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getSessionContext(req, res) {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID is required',
                });
            }

            const context = ChatbotService.getSessionContext(sessionId);

            return res.status(200).json({
                success: true,
                data: {
                    sessionId,
                    context,
                },
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async clearSession(req, res) {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID is required',
                });
            }

            ChatbotService.clearSession(sessionId);

            return res.status(200).json({
                success: true,
                message: 'Session cleared successfully',
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new ChatbotController();