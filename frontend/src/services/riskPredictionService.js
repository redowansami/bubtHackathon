import api from './api';

const riskPredictionService = {
    /**
     * Get inventory items (used to fetch items for risk prediction)
     */
    getInventory: async () => {
        try {
            const response = await api.get('/inventory');
            return {
                success: response.data.success,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || 'Failed to fetch inventory',
            };
        }
    },

    /**
     * Get expiring items
     */
    getExpiringItems: async (daysThreshold = 3) => {
        try {
            const response = await api.get('/inventory/expiring', {
                params: { daysThreshold },
            });
            return {
                success: response.data.success,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || 'Failed to fetch expiring items',
            };
        }
    },

    /**
     * Get inventory summary
     */
    getInventorySummary: async () => {
        try {
            const response = await api.get('/inventory/summary');
            return {
                success: response.data.success,
                data: response.data.data || {},
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                data: {},
                message: error.response?.data?.message || 'Failed to fetch inventory summary',
            };
        }
    },

    /**
     * Get consumption logs (for alert tracking)
     */
    getConsumptionLogs: async () => {
        try {
            const response = await api.get('/consumption');
            return {
                success: response.data.success,
                data: response.data.data || [],
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || 'Failed to fetch consumption logs',
            };
        }
    },

    /**
     * Calculate risk scores for items
     * Risk Score = combination of days to expiry, category, and other factors
     */
    calculateRiskScore: (item) => {
        if (!item) return 0;

        const daysLeft = item.expirationDays || 0;
        const category = item.category || 'Other';

        // Category risk multipliers (higher = more perishable)
        const categoryRisk = {
            'Dairy': 0.90,
            'Protein': 0.85,
            'Vegetables': 0.80,
            'Fruits': 0.75,
            'Bakery': 0.70,
            'Beverages': 0.50,
            'Condiments': 0.30,
            'Grains': 0.40,
            'Frozen': 0.35,
            'Snacks': 0.25,
            'Other': 0.50,
        };

        // Days to expiry risk calculation (0-100 scale)
        let expiryRisk = 0;
        if (daysLeft <= 0) {
            expiryRisk = 100; // Expired
        } else if (daysLeft <= 1) {
            expiryRisk = 90; // Critical
        } else if (daysLeft <= 3) {
            expiryRisk = 75; // High
        } else if (daysLeft <= 7) {
            expiryRisk = 50; // Medium
        } else if (daysLeft <= 14) {
            expiryRisk = 25; // Low
        } else {
            expiryRisk = 10; // Very low
        }

        // Quantity factor (less quantity = higher priority to consume)
        const quantityFactor = Math.min(1, Math.max(0.1, 1 / (item.quantity || 1)));

        // Combined risk score (0-100)
        const riskScore = (expiryRisk * 0.5 + categoryRisk[category] * 100 * 0.3 + quantityFactor * 100 * 0.2);

        return Math.min(100, Math.round(riskScore * 10) / 10);
    },

    /**
     * Get risk level based on score
     */
    getRiskLevel: (score) => {
        if (score >= 80) return 'CRITICAL';
        if (score >= 60) return 'HIGH';
        if (score >= 40) return 'MEDIUM';
        if (score >= 20) return 'LOW';
        return 'MINIMAL';
    },

    /**
     * Get risk level icon
     */
    getRiskLevelIcon: (level) => {
        const icons = {
            'CRITICAL': '⚠️',
            'HIGH': '🔥',
            'MEDIUM': '⏱️',
            'LOW': '✓',
            'MINIMAL': '✅',
        };
        return icons[level] || '⚪';
    },

    /**
     * Get risk level color
     */
    getRiskLevelColor: (level) => {
        const colors = {
            'CRITICAL': '#dc2626', // red-600
            'HIGH': '#f59e0b', // amber-500
            'MEDIUM': '#eab308', // yellow-400
            'LOW': '#84cc16', // lime-500
            'MINIMAL': '#10b981', // emerald-500
        };
        return colors[level] || '#6b7280';
    },

    /**
     * Get risk level background color
     */
    getRiskLevelBgColor: (level) => {
        const colors = {
            'CRITICAL': '#fee2e2', // red-100
            'HIGH': '#fef3c7', // amber-100
            'MEDIUM': '#fef08a', // yellow-100
            'LOW': '#dcfce7', // green-100
            'MINIMAL': '#d1fae5', // emerald-100
        };
        return colors[level] || '#f3f4f6';
    },

    /**
     * Get recommended action based on risk level
     */
    getRecommendedAction: (level, item) => {
        const actions = {
            'CRITICAL': `⚠️ Consume ${item?.itemName} immediately or dispose of it!`,
            'HIGH': `🔔 Prioritize consuming ${item?.itemName} within the next 1-2 days`,
            'MEDIUM': `📌 Plan to consume ${item?.itemName} within the next week`,
            'LOW': `✓ ${item?.itemName} is safe, consume within 2 weeks`,
            'MINIMAL': `✅ ${item?.itemName} is fresh, no immediate action needed`,
        };
        return actions[level] || 'Monitor this item';
    },

    /**
     * Sort items by risk score (highest risk first)
     */
    sortByRiskScore: (items) => {
        return items.map(item => ({
            ...item,
            riskScore: riskPredictionService.calculateRiskScore(item),
        }))
            .sort((a, b) => b.riskScore - a.riskScore);
    },
};

export default riskPredictionService;
