import api from './api';

export const consumptionService = {
    // Log consumption
    logConsumption: async (consumptionData) => {
        const response = await api.post('/consumption', consumptionData);
        return response.data;
    },

    // Get consumption history
    getHistory: async () => {
        const response = await api.get('/consumption/history');
        return response.data;
    },

    // Get recent consumption logs
    getRecent: async () => {
        const response = await api.get('/consumption/recent');
        return response.data;
    },

    // Get consumption by date range
    getByDateRange: async (startDate, endDate) => {
        const response = await api.get('/consumption/range', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    // Get consumption summary
    getSummary: async () => {
        const response = await api.get('/consumption/summary');
        return response.data;
    },

    // Update consumption log
    updateLog: async (logId, logData) => {
        const response = await api.put(`/consumption/${logId}`, logData);
        return response.data;
    },

    // Delete consumption log
    deleteLog: async (logId) => {
        const response = await api.delete(`/consumption/${logId}`);
        return response.data;
    },
};

export default consumptionService;
