import React, { useState, useEffect } from 'react';
import { Lock, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { DIETARY_PREFERENCES_LABELS } from '../utils/constants';

export const Profile = () => {
    const { updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        householdSize: 1,
        budget: 0,
        dietaryPreferences: 'no-preference',
        location: '',
    });    // Load user profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await authService.getProfile();
            if (response.success) {
                const userData = response.data;
                setFormData({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    householdSize: userData.householdSize || 1,
                    budget: userData.budget || 0,
                    dietaryPreferences: userData.dietaryPreferences || 'no-preference',
                    location: userData.location || '',
                });
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Full name must be at least 3 characters';
        }
        if (formData.householdSize < 1) {
            newErrors.householdSize = 'Household size must be at least 1';
        }
        if (formData.budget < 0) {
            newErrors.budget = 'Budget cannot be negative';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'householdSize' || name === 'budget' ? parseInt(value) || 0 : value,
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

        setEditLoading(true);
        try {
            const response = await authService.updateProfile(formData);
            if (response.success) {
                updateUser(response.data);
                toast.success('Profile updated successfully!');
            } else {
                toast.error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
                    </div>

                    {/* Profile Information Card */}
                    <Card title="Profile Information" subtitle="Update your personal details" className="mb-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    error={errors.fullName}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Household Size"
                                    type="number"
                                    name="householdSize"
                                    value={formData.householdSize}
                                    onChange={handleChange}
                                    error={errors.householdSize}
                                    min="1"
                                    required
                                />

                                <Input
                                    label="Monthly Budget"
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    error={errors.budget}
                                    min="0"
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700 mb-2">
                                        Dietary Preference
                                    </label>
                                    <select
                                        id="dietaryPreferences"
                                        name="dietaryPreferences"
                                        value={formData.dietaryPreferences}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        {Object.entries(DIETARY_PREFERENCES_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Input
                                    label="Location"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Your city, country"
                                />
                            </div>

                            <Button type="submit" isLoading={editLoading} className="w-full md:w-auto">
                                Save Changes
                            </Button>
                        </form>
                    </Card>

                    {/* Profile Picture Card (UI only) */}
                    <Card title="Profile Picture" subtitle="Upload a profile photo" className="mb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                                <Camera className="text-primary-600" size={48} />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">
                                    Upload a profile picture to personalize your account.
                                </p>
                                <Button variant="secondary" disabled>
                                    Upload Photo (Coming Soon)
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Change Password Card (UI only) */}
                    <Card title="Security" subtitle="Change your password regularly for better security">
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                                <Lock className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-blue-900 font-medium">Password Change Coming Soon</p>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Password change functionality will be available in the next update.
                                    </p>
                                </div>
                            </div>
                            <Button variant="secondary" disabled>
                                Change Password (Coming Soon)
                            </Button>
                        </div>
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default Profile;
