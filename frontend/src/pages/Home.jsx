import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingDown, Zap, Book } from 'lucide-react';
import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';

export const Home = () => {
    const features = [
        {
            icon: TrendingDown,
            title: 'Track Food Usage',
            description: 'Monitor your daily food consumption and inventory levels',
        },
        {
            icon: Zap,
            title: 'Reduce Waste',
            description: 'Get smart alerts about expiring items and waste reduction tips',
        },
        {
            icon: Book,
            title: 'Learn & Grow',
            description: 'Access sustainability resources and eco-friendly practices',
        },
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="min-h-[60vh] flex items-center justify-center py-12 sm:py-20">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <Leaf className="text-primary-600" size={48} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        AI-Powered Food Management Platform
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Track your food consumption, reduce waste, and live sustainably. Join thousands of users
                        making a positive impact on the environment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button className="px-8 py-3 text-lg">Get Started</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" className="px-8 py-3 text-lg">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-24">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose INNOVATEX?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our platform helps you manage food more efficiently while contributing to a sustainable future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                    <Icon className="text-primary-600" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-12 text-center my-16">
                <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                <p className="text-lg mb-8 text-primary-50">
                    Start your journey towards sustainable food management today.
                </p>
                <Link to="/register">
                    <Button className="bg-white text-primary-600 hover:bg-primary-50">
                        Join Us Now
                    </Button>
                </Link>
            </section>
        </Layout>
    );
};

export default Home;
