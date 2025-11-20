import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingDown, Activity, BookOpen, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import inventoryService from '../services/inventoryService';
import consumptionService from '../services/consumptionService';
import resourceService from '../services/resourceService';
import { formatDate } from '../utils/constants';

export const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        {
            icon: Package,
            label: 'Total Inventory Items',
            value: 0,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            icon: TrendingDown,
            label: 'Items Expiring Soon',
            value: 0,
            color: 'bg-red-100 text-red-600',
        },
        {
            icon: Activity,
            label: 'Consumption Logs This Week',
            value: 0,
            color: 'bg-green-100 text-green-600',
        },
        {
            icon: BookOpen,
            label: 'Resources Available',
            value: 0,
            color: 'bg-accent-100 text-accent-600',
        },
    ]);
    const [recentLogs, setRecentLogs] = useState([]);
    const [expiringItems, setExpiringItems] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch inventory stats
            const inventoryRes = await inventoryService.getInventory();
            const expiringRes = await inventoryService.getExpiringItems();
            
            // Fetch consumption logs
            const consumptionRes = await consumptionService.getRecent();
            
            // Fetch resources
            const resourcesRes = await resourceService.getAllResources();

            if (inventoryRes.success && expiringRes.success && consumptionRes.success && resourcesRes.success) {
                const inventoryItems = Array.isArray(inventoryRes.data) ? inventoryRes.data : [];
                const expiringItemsList = Array.isArray(expiringRes.data) ? expiringRes.data : [];
                const consumptionLogs = Array.isArray(consumptionRes.data) ? consumptionRes.data : [];
                const resourcesList = Array.isArray(resourcesRes.data) ? resourcesRes.data : [];

                // Update stats
                setStats([
                    {
                        icon: Package,
                        label: 'Total Inventory Items',
                        value: inventoryItems.length,
                        color: 'bg-blue-100 text-blue-600',
                    },
                    {
                        icon: TrendingDown,
                        label: 'Items Expiring Soon',
                        value: expiringItemsList.length,
                        color: 'bg-red-100 text-red-600',
                    },
                    {
                        icon: Activity,
                        label: 'Consumption Logs This Week',
                        value: consumptionLogs.length,
                        color: 'bg-green-100 text-green-600',
                    },
                    {
                        icon: BookOpen,
                        label: 'Resources Available',
                        value: resourcesList.length,
                        color: 'bg-accent-100 text-accent-600',
                    },
                ]);

                setRecentLogs(consumptionLogs.slice(0, 5));
                setExpiringItems(expiringItemsList.slice(0, 5));
            } else {
                setStats([
                    {
                        icon: Package,
                        label: 'Total Inventory Items',
                        value: 0,
                        color: 'bg-blue-100 text-blue-600',
                    },
                    {
                        icon: TrendingDown,
                        label: 'Items Expiring Soon',
                        value: 0,
                        color: 'bg-red-100 text-red-600',
                    },
                    {
                        icon: Activity,
                        label: 'Consumption Logs This Week',
                        value: 0,
                        color: 'bg-green-100 text-green-600',
                    },
                    {
                        icon: BookOpen,
                        label: 'Resources Available',
                        value: 0,
                        color: 'bg-accent-100 text-accent-600',
                    },
                ]);
                setRecentLogs([]);
                setExpiringItems([]);
            }
        } catch (error) {
            toast.error('Failed to load dashboard data');
            setRecentLogs([]);
            setExpiringItems([]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: 'Add to Inventory',
            description: 'Add new items to your inventory',
            link: '/inventory',
            color: 'primary',
        },
        {
            title: 'Log Consumption',
            description: 'Track what you consumed',
            link: '/logs',
            color: 'primary',
        },
        {
            title: 'View Resources',
            description: 'Learn sustainability tips',
            link: '/resources',
            color: 'primary',
        },
    ];

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="flex justify-center items-center py-12">
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.fullName}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's your food management overview for today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="flex flex-col items-center text-center">
                                <div className={`p-3 rounded-lg mb-4 ${stat.color}`}>
                                    <Icon size={32} />
                                </div>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Card key={index}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {action.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm">{action.description}</p>
                                <Link to={action.link}>
                                    <Button className="w-full">
                                        <Plus size={20} />
                                        Get Started
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Expiring Items Section */}
                {expiringItems.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Items Expiring Soon</h2>
                        <Card>
                            <div className="space-y-4">
                                {expiringItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                                            <p className="text-sm text-gray-600">
                                                Expires: {formatDate(item.expiryDate)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-red-600">
                                            {item.expirationDays} days left
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Recent Activity */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <Card>
                        {recentLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">No activity yet</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Start by adding items to your inventory or logging consumption
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentLogs.map((log) => (
                                    <div
                                        key={log._id}
                                        className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{log.itemName}</h4>
                                            <p className="text-sm text-gray-600">
                                                {log.category} • {formatDate(log.date)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-primary-600">
                                            Qty: {log.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default Dashboard;
