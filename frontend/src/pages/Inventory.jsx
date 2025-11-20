import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import inventoryService from '../services/inventoryService';
import { formatDate, formatCurrency } from '../utils/constants';

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

export const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [filterCategory, setFilterCategory] = useState('All');
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Vegetables',
        quantity: '',
        expirationDays: '',
        expiryDate: '',
        costPerUnit: '',
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await inventoryService.getInventory();
            if (response.success) {
                setItems(Array.isArray(response.data) ? response.data : []);
            } else {
                setItems([]);
            }
        } catch (error) {
            toast.error('Failed to load inventory');
            setItems([]);
        } finally {
            setLoading(false);
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
        }
        if (!formData.expirationDays) {
            newErrors.expirationDays = 'Expiration days is required';
        } else if (parseInt(formData.expirationDays) < 1) {
            newErrors.expirationDays = 'Expiration days must be at least 1';
        }
        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
        }
        if (!formData.costPerUnit) {
            newErrors.costPerUnit = 'Cost per unit is required';
        } else if (parseFloat(formData.costPerUnit) < 0) {
            newErrors.costPerUnit = 'Cost cannot be negative';
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
            if (editingId) {
                const response = await inventoryService.updateItem(editingId, formData);
                if (response.success) {
                    toast.success('Item updated successfully!');
                    setItems(items.map((item) => (item._id === editingId ? response.data : item)));
                }
            } else {
                const response = await inventoryService.addItem(formData);
                if (response.success) {
                    toast.success('Item added successfully!');
                    setItems([...items, response.data]);
                }
            }
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save item');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            itemName: item.itemName,
            category: item.category,
            quantity: item.quantity.toString(),
            expirationDays: item.expirationDays.toString(),
            expiryDate: item.expiryDate.split('T')[0],
            costPerUnit: item.costPerUnit.toString(),
        });
        setEditingId(item._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await inventoryService.deleteItem(itemId);
                if (response.success) {
                    toast.success('Item deleted successfully!');
                    setItems(items.filter((item) => item._id !== itemId));
                }
            } catch (error) {
                toast.error('Failed to delete item');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            itemName: '',
            category: 'Vegetables',
            quantity: '',
            expirationDays: '',
            expiryDate: '',
            costPerUnit: '',
        });
        setEditingId(null);
        setErrors({});
    };

    const handleCloseModal = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const filteredItems =
        filterCategory === 'All'
            ? items
            : items.filter((item) => item.category === filterCategory);

    return (
        <ProtectedRoute>
            <Layout>
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                        <p className="text-gray-600 mt-2">Track and manage your food items</p>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="mt-4 md:mt-0"
                    >
                        <Plus size={20} />
                        Add Item
                    </Button>
                </div>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingId ? 'Edit Item' : 'Add New Item'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Item Name"
                            type="text"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            error={errors.itemName}
                            required
                        />

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
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
                            label="Expiration Days"
                            type="number"
                            name="expirationDays"
                            value={formData.expirationDays}
                            onChange={handleChange}
                            error={errors.expirationDays}
                            min="1"
                            required
                        />

                        <Input
                            label="Expiry Date"
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            error={errors.expiryDate}
                            required
                        />

                        <Input
                            label="Cost Per Unit"
                            type="number"
                            name="costPerUnit"
                            value={formData.costPerUnit}
                            onChange={handleChange}
                            error={errors.costPerUnit}
                            min="0"
                            step="0.01"
                            required
                        />

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
                                {editingId ? 'Update' : 'Add'} Item
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
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

                {/* Items Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-600">Loading inventory...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No items found</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {filterCategory === 'All'
                                    ? 'Start by adding your first inventory item'
                                    : 'No items in this category'}
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <Card key={item._id}>
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Quantity:</span>
                                        <span className="font-semibold text-gray-900">{item.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cost:</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(item.costPerUnit)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expires:</span>
                                        <span className="font-semibold text-gray-900">{formatDate(item.expiryDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Days Left:</span>
                                        <span
                                            className={`font-semibold ${
                                                item.expirationDays <= 3 ? 'text-red-600' : 'text-green-600'
                                            }`}
                                        >
                                            {item.expirationDays} days
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                                    >
                                        <Edit2 size={18} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Layout>
        </ProtectedRoute>
    );
};

export default Inventory;
