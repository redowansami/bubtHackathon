import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { DIETARY_PREFERENCES, DIETARY_PREFERENCES_LABELS } from '../../utils/constants';

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        householdSize: 1,
        dietaryPreferences: 'no-preference',
        location: '',
    });

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Full name must be at least 3 characters';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.householdSize || formData.householdSize < 1) {
            newErrors.householdSize = 'Household size must be at least 1';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'householdSize' ? parseInt(value) || 1 : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        try {
            const response = await authService.register(formData);
            if (response.success) {
                register(response.data.user, response.data.token);
                toast.success('Registration successful!');
                navigate('/dashboard');
            } else {
                toast.error(response.message || 'Registration failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Join INNOVATEX</h1>
                    <p className="text-gray-600 mt-2">
                        Step {step} of 2 - {step === 1 ? 'Create your account' : 'Set your preferences'}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2].map((s) => (
                        <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary-600' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <>
                            <Input
                                label="Full Name"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={errors.fullName}
                                placeholder="John Doe"
                                required
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="you@example.com"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="••••••••"
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                placeholder="••••••••"
                                required
                            />

                            <Button type="submit" className="w-full">
                                Next Step
                            </Button>
                        </>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700 mb-2">
                                    Household Size <span className="text-red-600">*</span>
                                </label>
                                <input
                                    id="householdSize"
                                    type="number"
                                    name="householdSize"
                                    value={formData.householdSize}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                {errors.householdSize && (
                                    <p className="text-red-600 text-sm font-medium mt-1">{errors.householdSize}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700 mb-2">
                                    Dietary Preference <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="dietaryPreferences"
                                    name="dietaryPreferences"
                                    value={formData.dietaryPreferences}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    {DIETARY_PREFERENCES.map((pref) => (
                                        <option key={pref} value={pref}>
                                            {DIETARY_PREFERENCES_LABELS[pref]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Location (Optional)"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Your city, country"
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setStep(1)}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="flex-1"
                                >
                                    Create Account
                                </Button>
                            </div>
                        </>
                    )}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;
