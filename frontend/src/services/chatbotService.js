import api from './api';

const API_BASE = '/chatbot';

const chatbotService = {
    // General Q&A
    ask: (content, enableReasoning = false) =>
        api.post(`${API_BASE}/ask`, { content, enableReasoning }),

    // Food Waste Reduction
    getWasteReductionAdvice: (content, sessionId = null) =>
        api.post(`${API_BASE}/waste-reduction`, { content, sessionId }),

    // Nutrition Advice
    getNutritionAdvice: (content, sessionId = null) =>
        api.post(`${API_BASE}/nutrition`, { content, sessionId }),

    // Budget Meal Planning
    getBudgetMealPlan: (content, sessionId = null, context = null) =>
        api.post(`${API_BASE}/budget-meals`, { content, sessionId, context }),

    // Leftover Ideas
    getLeftoverIdeas: (content, sessionId = null) =>
        api.post(`${API_BASE}/leftovers`, { content, sessionId }),

    // Food Sharing Advice
    getFoodSharingAdvice: (content, sessionId = null) =>
        api.post(`${API_BASE}/food-sharing`, { content, sessionId }),

    // Environmental Impact
    getEnvironmentalImpact: (content, sessionId = null) =>
        api.post(`${API_BASE}/environment`, { content, sessionId }),

    // General Advice
    getGeneralAdvice: (content, sessionId = null, context = null) =>
        api.post(`${API_BASE}/advice`, { content, sessionId, context }),

    // Session Management
    getSessionHistory: (sessionId) =>
        api.get(`${API_BASE}/sessions/${sessionId}/history`),

    getSessionContext: (sessionId) =>
        api.get(`${API_BASE}/sessions/${sessionId}/context`),

    clearSession: (sessionId) =>
        api.delete(`${API_BASE}/sessions/${sessionId}`),
};

export default chatbotService;
