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
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
    const [formData, setFormData] = useState({
        inventoryItemId: '',
        itemName: '',
        category: 'Vegetables',
        quantity: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsResponse, inventoryResponse] = await Promise.all([
                consumptionService.getHistory(),
                inventoryService.getInventory(),
            ]);

            if (logsResponse.success) {
                setLogs(Array.isArray(logsResponse.data) ? logsResponse.data : []);
            } else {
                setLogs([]);
            }

            if (inventoryResponse.success) {
                const items = Array.isArray(inventoryResponse.data) ? inventoryResponse.data : [];
                setInventoryItems(items.filter((item) => item.quantity > 0));
            } else {
                setInventoryItems([]);
            }
        } catch (error) {
            toast.error('Failed to load data');
            setLogs([]);
            setInventoryItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInventoryItemSelect = (e) => {
        const itemId = e.target.value;
        const item = inventoryItems.find((inv) => inv._id === itemId);

        if (item) {
            setSelectedInventoryItem(item);
            setFormData((prev) => ({
                ...prev,
                inventoryItemId: item._id,
                itemName: item.itemName,
                category: item.category,
                quantity: '',
            }));
        } else {
            setSelectedInventoryItem(null);
            setFormData((prev) => ({
                ...prev,
                inventoryItemId: '',
                itemName: '',
                category: 'Vegetables',
                quantity: '',
            }));
        }

        if (errors.inventoryItemId) {
            setErrors((prev) => ({
                ...prev,
                inventoryItemId: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.inventoryItemId) {
            newErrors.inventoryItemId = 'Please select an inventory item';
        }

        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else {
            const qty = parseInt(formData.quantity);
            if (qty < 1) {
                newErrors.quantity = 'Quantity must be at least 1';
            } else if (selectedInventoryItem && qty > selectedInventoryItem.quantity) {
                newErrors.quantity = `Cannot exceed available quantity (${selectedInventoryItem.quantity})`;
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                inventoryItemId: formData.inventoryItemId,
                itemName: formData.itemName,
                category: formData.category,
                quantity: parseInt(formData.quantity),
                date: formData.date ? new Date(formData.date).toISOString() : undefined,
                notes: formData.notes || '',
            };

            if (editingId) {
                const response = await consumptionService.updateLog(editingId, dataToSubmit);
                if (response.success) {
                    toast.success('Log updated successfully!');
                    setLogs(logs.map((log) => (log._id === editingId ? response.data : log)));
                } else {
                    toast.error(response.message || 'Failed to update log');
                }
            } else {
                const response = await consumptionService.logConsumption(dataToSubmit);
                if (response.success) {
                    toast.success('Consumption logged successfully!');
                    setLogs([...logs, response.data]);
                    await fetchData();
                } else {
                    toast.error(response.message || 'Failed to log consumption');
                }
            }
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save log');
        }
    };

    const handleEdit = (log) => {
        const item = inventoryItems.find((inv) => inv._id === log.inventoryItemId);
        setSelectedInventoryItem(item);
        setFormData({
            inventoryItemId: log.inventoryItemId,
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
        if (window.confirm('Are you sure you want to delete this log entry? This will restore the inventory quantity.')) {
            try {
                const response = await consumptionService.deleteLog(logId);
                if (response.success) {
                    toast.success('Log deleted and inventory restored!');
                    setLogs(logs.filter((log) => log._id !== logId));
                    await fetchData();
                } else {
                    toast.error(response.message || 'Failed to delete log');
                }
            } catch (error) {
                toast.error('Failed to delete log');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            inventoryItemId: '',
            itemName: '',
            category: 'Vegetables',
            quantity: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });
        setSelectedInventoryItem(null);
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
                        disabled={inventoryItems.length === 0}
                    >
                        <Plus size={20} />
                        Log Consumption
                    </Button>
                </div>

                {inventoryItems.length === 0 && (
                    <Card className="mb-6 bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <p className="font-semibold text-blue-900">No inventory items available</p>
                                <p className="text-blue-800 text-sm mt-1">
                                    Add items to your inventory first before logging consumption.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Log' : 'Log Consumption'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="inventoryItemId" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Item from Inventory <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="inventoryItemId"
                                value={formData.inventoryItemId}
                                onChange={handleInventoryItemSelect}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                    errors.inventoryItemId ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">-- Select an inventory item --</option>
                                {inventoryItems.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.itemName} ({item.category}) - Available: {item.quantity}
                                    </option>
                                ))}
                            </select>
                            {errors.inventoryItemId && (
                                <p className="text-red-500 text-sm mt-1">{errors.inventoryItemId}</p>
                            )}
                        </div>

                        {selectedInventoryItem && (
                            <Card className="bg-primary-50 border-primary-200">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Item:</span>
                                        <span className="font-semibold">{selectedInventoryItem.itemName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-semibold">{selectedInventoryItem.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Available:</span>
                                        <span className="font-semibold text-primary-600">{selectedInventoryItem.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expires:</span>
                                        <span className="font-semibold">{formatDate(selectedInventoryItem.expiryDate)}</span>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Input
                            label={`Quantity to Consume ${selectedInventoryItem ? `(Max: ${selectedInventoryItem.quantity})` : ''}`}
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            error={errors.quantity}
                            min="1"
                            max={selectedInventoryItem?.quantity || undefined}
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
                {logs.length > 0 && (
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
                )}

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
