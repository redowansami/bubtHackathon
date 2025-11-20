import api from './api';

export const inventoryService = {
    // Add new inventory item
    addItem: async (itemData) => {
        const response = await api.post('/inventory', itemData);
        return response.data;
    },

    // Get all inventory items
    getInventory: async () => {
        const response = await api.get('/inventory');
        return response.data;
    },

    // Get expiring items
    getExpiringItems: async () => {
        const response = await api.get('/inventory/expiring');
        return response.data;
    },

    // Get items by category
    getByCategory: async (category) => {
        const response = await api.get('/inventory/category', {
            params: { category },
        });
        return response.data;
    },

    // Get inventory summary
    getSummary: async () => {
        const response = await api.get('/inventory/summary');
        return response.data;
    },

    // Update inventory item
    updateItem: async (itemId, itemData) => {
        const response = await api.put(`/inventory/${itemId}`, itemData);
        return response.data;
    },

    // Delete inventory item
    deleteItem: async (itemId) => {
        const response = await api.delete(`/inventory/${itemId}`);
        return response.data;
    },
};

export default inventoryService;
