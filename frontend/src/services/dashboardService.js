import api from './api';

export const dashboardService = {
    // Get complete dashboard
    getDashboard: async () => {
        const response = await api.get('/dashboard');
        return response.data;
    },

    // Get quick statistics
    getQuickStats: async () => {
        const response = await api.get('/dashboard/quick-stats');
        return response.data;
    },

    // Get analytics data
    getAnalytics: async () => {
        const response = await api.get('/dashboard/analytics');
        return response.data;
    },
};

export default dashboardService;
