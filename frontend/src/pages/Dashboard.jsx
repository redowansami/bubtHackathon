import React from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingDown, Activity, BookOpen, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
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
    ];

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

                {/* Recent Activity */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <Card>
                        <div className="text-center py-12">
                            <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No activity yet</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Start by adding items to your inventory or logging consumption
                            </p>
                        </div>
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default Dashboard;
