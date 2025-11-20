import api from './api';

export const resourceService = {
    // Get all resources
    getAllResources: async () => {
        const response = await api.get('/resources');
        return response.data;
    },

    // Search resources
    search: async (query) => {
        const response = await api.get('/resources/search', {
            params: { query },
        });
        return response.data;
    },

    // Get resources by type
    getByType: async (type) => {
        const response = await api.get(`/resources/type/${type}`);
        return response.data;
    },

    // Get resources by category
    getByCategory: async (category) => {
        const response = await api.get(`/resources/category/${category}`);
        return response.data;
    },

    // Get most viewed resources
    getMostViewed: async () => {
        const response = await api.get('/resources/most-viewed');
        return response.data;
    },

    // Get recommended resources
    getRecommendations: async () => {
        const response = await api.get('/resources/recommend');
        return response.data;
    },

    // Get resource by ID
    getResourceById: async (resourceId) => {
        const response = await api.get(`/resources/${resourceId}`);
        return response.data;
    },

    // Create new resource (admin)
    createResource: async (resourceData) => {
        const response = await api.post('/resources', resourceData);
        return response.data;
    },
};

export default resourceService;
