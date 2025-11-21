/**
 * Session Memory Manager - Maintains conversation context for prompt chaining
 * Supports multiple concurrent sessions with in-memory storage
 */

class SessionMemoryManager {
    constructor() {
        this.sessions = new Map();
        // Auto-cleanup sessions after 24 hours of inactivity
        this.cleanupInterval = 24 * 60 * 60 * 1000;
    }

    /**
     * Create or get a session
     * @param {String} sessionId - Unique session identifier
     * @returns {Object} Session object
     */
    getSession(sessionId) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                id: sessionId,
                messages: [],
                context: {},
                createdAt: new Date(),
                lastUpdated: new Date(),
            });
        } else {
            // Update last accessed time
            const session = this.sessions.get(sessionId);
            session.lastUpdated = new Date();
        }
        return this.sessions.get(sessionId);
    }

    /**
     * Add a message to session history
     * @param {String} sessionId - Session ID
     * @param {String} role - 'user' or 'assistant'
     * @param {String} content - Message content
     */
    addMessage(sessionId, role, content) {
        const session = this.getSession(sessionId);
        session.messages.push({
            role,
            content,
            timestamp: new Date(),
        });
    }

    /**
     * Get conversation history for a session
     * @param {String} sessionId - Session ID
     * @returns {Array} Array of messages
     */
    getHistory(sessionId) {
        const session = this.getSession(sessionId);
        return session.messages;
    }

    /**
     * Get last N messages from session
     * @param {String} sessionId - Session ID
     * @param {Number} n - Number of recent messages to retrieve
     * @returns {Array} Last N messages
     */
    getRecentMessages(sessionId, n = 10) {
        const history = this.getHistory(sessionId);
        return history.slice(Math.max(0, history.length - n));
    }

    /**
     * Set context for a session (e.g., user preferences, dietary restrictions)
     * @param {String} sessionId - Session ID
     * @param {Object} context - Context object
     */
    setContext(sessionId, context) {
        const session = this.getSession(sessionId);
        session.context = { ...session.context, ...context };
    }

    /**
     * Get context for a session
     * @param {String} sessionId - Session ID
     * @returns {Object} Session context
     */
    getContext(sessionId) {
        const session = this.getSession(sessionId);
        return session.context;
    }

    /**
     * Clear all messages in a session
     * @param {String} sessionId - Session ID
     */
    clearHistory(sessionId) {
        const session = this.getSession(sessionId);
        session.messages = [];
    }

    /**
     * Delete a session
     * @param {String} sessionId - Session ID
     */
    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
    }

    /**
     * Format messages for LLM context (including system prompt)
     * @param {String} sessionId - Session ID
     * @param {String} systemPrompt - System prompt to include
     * @returns {Array} Formatted messages for API call
     */
    formatMessagesForAPI(sessionId, systemPrompt = null) {
        const history = this.getHistory(sessionId);
        const messages = [];

        // Add system message if provided
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt,
            });
        }

        // Add conversation history
        messages.push(...history);

        return messages;
    }

    /**
     * Get session stats
     * @param {String} sessionId - Session ID
     * @returns {Object} Session statistics
     */
    getSessionStats(sessionId) {
        const session = this.getSession(sessionId);
        const messageCount = session.messages.length;
        const userMessages = session.messages.filter((m) => m.role === 'user').length;
        const assistantMessages = session.messages.filter((m) => m.role === 'assistant').length;

        return {
            sessionId,
            totalMessages: messageCount,
            userMessages,
            assistantMessages,
            createdAt: session.createdAt,
            lastUpdated: session.lastUpdated,
            contextKeys: Object.keys(session.context),
        };
    }

    /**
     * Get all active sessions
     * @returns {Array} Array of session IDs
     */
    getActiveSessions() {
        return Array.from(this.sessions.keys());
    }

    /**
     * Cleanup old sessions (optional maintenance)
     */
    cleanupOldSessions() {
        const now = new Date();
        const threshold = this.cleanupInterval;

        for (const [sessionId, session] of this.sessions) {
            if (now - session.lastUpdated > threshold) {
                this.sessions.delete(sessionId);
                console.log(`Cleaned up old session: ${sessionId}`);
            }
        }
    }
}

// Singleton instance
const sessionManager = new SessionMemoryManager();

// Run cleanup every hour
setInterval(() => {
    sessionManager.cleanupOldSessions();
}, 60 * 60 * 1000);

module.exports = sessionManager;
