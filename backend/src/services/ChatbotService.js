const axios = require('axios');
const { OPENROUTER_API_KEY } = require('../config/constants');
const foodKnowledgeBase = require('../utils/foodKnowledgeBase');
const sessionManager = require('../utils/SessionMemoryManager');

class ChatbotService {
    constructor() {
        this.apiKey = OPENROUTER_API_KEY;
        this.model = 'x-ai/grok-4.1-fast:free';
    }

    /**
     * Call OpenRouter API with message history (supports prompt chaining)
     */
    async callOpenRouter(messages, enableReasoning = false) {
        try {
            if (!this.apiKey) {
                throw new Error('OPENROUTER_API_KEY is not configured');
            }

            const payload = {
                model: this.model,
                messages,
            };

            if (enableReasoning) {
                payload.reasoning = { enabled: true };
            }

            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', payload, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            if (!response.data.choices || response.data.choices.length === 0) {
                throw new Error('No response from OpenRouter API');
            }

            return response.data.choices[0].message;
        } catch (error) {
            console.error('API Error:', error.message);
            throw error;
        }
    }

    /**
     * General Q&A (stateless)
     */
    async askQuestion(content, enableReasoning = false) {
        const messages = [
            {
                role: 'user',
                content,
            },
        ];

        const message = await this.callOpenRouter(messages, enableReasoning);
        return {
            content: message.content,
            reasoning_details: message.reasoning_details || null,
        };
    }

    /**
     * Food Waste Reduction Advice (with context memory)
     */
    async getWasteReductionAdvice(sessionId, userQuery) {
        // Add to session history
        sessionManager.addMessage(sessionId, 'user', userQuery);

        // Get knowledge base tips
        const tipsSummary = foodKnowledgeBase.wasteReduction
            .map((section) => `${section.title}: ${section.tips.join('; ')}`)
            .join('\n\n');

        // Build system prompt
        const systemPrompt = `You are an expert in food waste reduction. Use this knowledge base to help users:

${tipsSummary}

Provide practical, personalized advice based on the user's situation. Reference relevant tips from the knowledge base.`;

        // Get message history for context
        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * Nutrition Balancing Guidance (with context memory)
     */
    async getNutritionAdvice(sessionId, userQuery) {
        sessionManager.addMessage(sessionId, 'user', userQuery);

        const tipsSummary = foodKnowledgeBase.nutrition
            .map((section) => `${section.title}: ${section.tips.join('; ')}`)
            .join('\n\n');

        const systemPrompt = `You are a nutrition expert. Help users balance their diet using these guidelines:

${tipsSummary}

Provide personalized nutrition advice based on their dietary goals and constraints. Be specific about food combinations and portion sizes.`;

        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * Budget Meal Planning (with context memory)
     */
    async getBudgetMealPlan(sessionId, userQuery) {
        sessionManager.addMessage(sessionId, 'user', userQuery);

        const context = sessionManager.getContext(sessionId);
        const tipsSummary = foodKnowledgeBase.budgetMealing
            .map((section) => `${section.title}: ${section.tips.join('; ')}`)
            .join('\n\n');

        const systemPrompt = `You are a budget meal planning expert. Help users create affordable meal plans using:

${tipsSummary}

Consider their budget, family size, and dietary preferences. Provide specific meal ideas with estimated costs.${context.budget ? `\nBudget constraint: ${context.budget}` : ''
            }`;

        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * Leftover Transformation Ideas (with context memory)
     */
    async getLeftoverIdeas(sessionId, userQuery) {
        sessionManager.addMessage(sessionId, 'user', userQuery);

        const leftoversInfo = foodKnowledgeBase.leftovers
            .map((item) => `${item.category}: ${item.ideas.join('; ')}`)
            .join('\n\n');

        const systemPrompt = `You are a creative chef specializing in transforming leftovers. Help users use their leftover food:

${leftoversInfo}

Suggest creative, tasty recipes that can be made from the leftovers mentioned. Provide step-by-step instructions.`;

        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * Local Food Sharing Guidance (with context memory)
     */
    async getFoodSharingAdvice(sessionId, userQuery) {
        sessionManager.addMessage(sessionId, 'user', userQuery);

        const sharingInfo = foodKnowledgeBase.foodSharing
            .map((section) => `${section.title}: ${section.tips.join('; ')}`)
            .join('\n\n');

        const systemPrompt = `You are an expert in community food sharing and local resources. Help users:

${sharingInfo}

Provide information about local food sharing opportunities, proper food donation guidelines, and community resources.`;

        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * Environmental Impact Explanation (with context memory)
     */
    async getEnvironmentalImpact(sessionId, userQuery) {
        sessionManager.addMessage(sessionId, 'user', userQuery);

        const environmentalInfo = foodKnowledgeBase.environment
            .map((section) => {
                if (section.impact) {
                    return `${section.title}:\nHighest: ${section.impact.highest}\nMedium: ${section.impact.medium}\nLowest: ${section.impact.lowest}`;
                }
                return `${section.title}: ${section.tips.join('; ')}`;
            })
            .join('\n\n');

        const systemPrompt = `You are an environmental science expert focused on food systems. Explain environmental impacts:

${environmentalInfo}

Help users understand the ecological impact of their food choices and suggest sustainable alternatives.`;

        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * General Food Advice with Context (uses session memory)
     */
    async getGeneralAdvice(sessionId, userQuery) {
        sessionManager.addMessage(sessionId, 'user', userQuery);

        const systemPrompt = `You are a helpful food and nutrition expert. Help users with questions about food, nutrition, sustainability, and meal planning. 
Use your knowledge to provide practical, evidence-based advice.`;

        const messages = sessionManager.formatMessagesForAPI(sessionId, systemPrompt);
        messages.push({ role: 'user', content: userQuery });

        const response = await this.callOpenRouter(messages, true);
        sessionManager.addMessage(sessionId, 'assistant', response.content);

        return {
            content: response.content,
            reasoning_details: response.reasoning_details || null,
            sessionId,
        };
    }

    /**
     * Get session history
     */
    getSessionHistory(sessionId) {
        return sessionManager.getHistory(sessionId);
    }

    /**
     * Get session context
     */
    getSessionContext(sessionId) {
        return sessionManager.getContext(sessionId);
    }

    /**
     * Set session context (e.g., dietary restrictions, budget)
     */
    setSessionContext(sessionId, context) {
        sessionManager.setContext(sessionId, context);
    }

    /**
     * Clear session
     */
    clearSession(sessionId) {
        sessionManager.clearHistory(sessionId);
    }
}

module.exports = new ChatbotService();