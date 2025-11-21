import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import consumptionService from '../services/consumptionService';
import inventoryService from '../services/inventoryService';
import { formatDate } from '../utils/constants';

const CATEGORIES = [
    'Dairy',
    'Vegetables',
    'Fruits',
    'Grains',
    'Protein',
    'Bakery',
    'Beverages',
    'Condiments',
    'Frozen',
    'Snacks',
    'Other',
];

export const ConsumptionLogs = () => {
    const [logs, setLogs] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [filterCategory, setFilterCategory] = useState('All');
    const [dateRange, setDateRange] = useState('all');
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Vegetables',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        fetchLogs();
        fetchInventoryItems();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await consumptionService.getHistory();
            if (response.success) {
                setLogs(Array.isArray(response.data) ? response.data : []);
            } else {
                setLogs([]);
            }
        } catch (error) {
            toast.error('Failed to load consumption logs');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const response = await inventoryService.getInventory();
            if (response.success && Array.isArray(response.data)) {
                setInventoryItems(response.data);
            } else {
                setInventoryItems([]);
            }
        } catch (error) {
            console.error('Failed to load inventory items:', error);
            setInventoryItems([]);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.itemName.trim()) {
            newErrors.itemName = 'Item name is required';
        } else if (formData.itemName.trim().length < 2) {
            newErrors.itemName = 'Item name must be at least 2 characters';
        }
        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (parseInt(formData.quantity) < 0) {
            newErrors.quantity = 'Quantity cannot be negative';
        } else {
            // Check if consumed quantity exceeds available quantity
            const selectedItem = inventoryItems.find(item => item.itemName === formData.itemName);
            if (selectedItem && parseInt(formData.quantity) > selectedItem.quantity) {
                newErrors.quantity = `Cannot consume more than available quantity (${selectedItem.quantity} available)`;
            }
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'itemName') {
            // Find the selected item and populate category
            const selectedItem = inventoryItems.find(item => item._id === value);
            if (selectedItem) {
                setFormData((prev) => ({
                    ...prev,
                    itemName: selectedItem.itemName,
                    category: selectedItem.category,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const dataToSubmit = {
                ...formData,
                date: formData.date ? new Date(formData.date).toISOString() : undefined,
            };

            if (editingId) {
                const response = await consumptionService.updateLog(editingId, dataToSubmit);
                if (response.success) {
                    toast.success('Log updated successfully!');
                    setLogs(logs.map((log) => (log._id === editingId ? response.data : log)));
                }
            } else {
                const response = await consumptionService.logConsumption(dataToSubmit);
                if (response.success) {
                    toast.success('Consumption logged successfully!');
                    setLogs([...logs, response.data]);
                }
            }
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save log');
        }
    };

    const handleEdit = (log) => {
        setFormData({
            itemName: log.itemName,
            category: log.category,
            quantity: log.quantity.toString(),
            date: log.date.split('T')[0],
            notes: log.notes || '',
        });
        setEditingId(log._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (logId) => {
        if (window.confirm('Are you sure you want to delete this log entry?')) {
            try {
                const response = await consumptionService.deleteLog(logId);
                if (response.success) {
                    toast.success('Log deleted successfully!');
                    setLogs(logs.filter((log) => log._id !== logId));
                }
            } catch (error) {
                toast.error('Failed to delete log');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            itemName: '',
            category: 'Vegetables',
            quantity: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });
        setEditingId(null);
        setErrors({});
    };

    const handleCloseModal = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const getDateRange = (range) => {
        const now = new Date();
        let startDate;

        switch (range) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                return logs || [];
        }

        return (logs || []).filter((log) => log && log.date && new Date(log.date) >= startDate);
    };

    let filteredLogs = getDateRange(dateRange) || [];
    if (filterCategory !== 'All') {
        filteredLogs = (filteredLogs || []).filter((log) => log && log.category === filterCategory);
    }

    return (
        <ProtectedRoute>
            <Layout>
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Consumption Logs</h1>
                        <p className="text-gray-600 mt-2">Track and manage your food consumption</p>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="mt-4 md:mt-0"
                    >
                        <Plus size={20} />
                        Log Consumption
                    </Button>
                </div>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Log' : 'Log Consumption'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Item <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="itemName"
                                name="itemName"
                                value={inventoryItems.find(item => item.itemName === formData.itemName)?._id || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            >
                                <option value="">-- Choose an item --</option>
                                {inventoryItems.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.itemName} ({item.category}) - Qty: {item.quantity}
                                    </option>
                                ))}
                            </select>
                            {errors.itemName && <p className="text-red-600 text-sm mt-1">{errors.itemName}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-600">*</span>
                            </label>
                            <input
                                id="category"
                                type="text"
                                value={formData.category}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <Input
                            label="Quantity"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            error={errors.quantity}
                            min="0"
                            required
                        />

                        <Input
                            label="Date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            error={errors.date}
                            required
                        />

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Add any notes about this consumption..."
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCloseModal}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                                {editingId ? 'Update' : 'Log'} Consumption
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Filters */}
                <div className="mb-6">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Date Range</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: 'All Time' },
                                { key: 'month', label: 'This Month' },
                                { key: 'week', label: 'This Week' },
                                { key: 'today', label: 'Today' },
                            ].map((range) => (
                                <button
                                    key={range.key}
                                    onClick={() => setDateRange(range.key)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        dateRange === range.key
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterCategory('All')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filterCategory === 'All'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                All
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filterCategory === cat
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Logs List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-600">Loading consumption logs...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No logs found</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {logs.length === 0
                                    ? 'Start logging your food consumption'
                                    : 'No logs for the selected filters'}
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <Card key={log._id}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1 mb-4 md:mb-0">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-primary-100 p-2 rounded-lg mt-1">
                                                <Calendar className="text-primary-600" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {log.itemName}
                                                </h3>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                    <span>Category: <strong>{log.category}</strong></span>
                                                    <span>Quantity: <strong>{log.quantity}</strong></span>
                                                    <span>Date: <strong>{formatDate(log.date)}</strong></span>
                                                </div>
                                                {log.notes && (
                                                    <p className="text-gray-600 text-sm mt-2">
                                                        <strong>Notes:</strong> {log.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(log)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                                        >
                                            <Edit2 size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(log._id)}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Layout>
        </ProtectedRoute>
    );
};

export default ConsumptionLogs;
