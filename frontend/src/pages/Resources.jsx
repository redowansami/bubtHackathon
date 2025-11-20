import React, { useState, useEffect } from 'react';
import { BookOpen, Search, AlertCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/layout/Layout';
import resourceService from '../services/resourceService';

const RESOURCE_TYPES = ['article', 'tip', 'guide', 'recipe', 'infographic', 'video'];
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
    'Storage',
    'Meal Planning',
    'Budget',
    'Waste Reduction',
    'Nutrition',
    'General',
];

export const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            console.log('Fetching resources from API...');
            const response = await resourceService.getAllResources();
            console.log('Resource response:', response);
            if (response.success) {
                console.log('Resources fetched successfully:', response.data);
                setResources(Array.isArray(response.data) ? response.data : []);
            } else {
                console.log('API returned success: false', response.message);
                setResources([]);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            toast.error('Failed to load resources: ' + (error.message || 'Unknown error'));
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchResources();
            return;
        }

        setLoading(true);
        try {
            const response = await resourceService.search(searchQuery);
            if (response.success) {
                setResources(Array.isArray(response.data) ? response.data : []);
                setActiveTab('search');
            }
        } catch (error) {
            toast.error('Failed to search resources');
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterType = async (type) => {
        setFilterType(type);
        if (type === 'All') {
            fetchResources();
        } else {
            setLoading(true);
            try {
                const response = await resourceService.getByType(type);
                if (response.success) {
                    setResources(Array.isArray(response.data) ? response.data : []);
                    setActiveTab('type');
                }
            } catch (error) {
                toast.error('Failed to filter by type');
                setResources([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFilterCategory = async (category) => {
        setFilterCategory(category);
        if (category === 'All') {
            fetchResources();
        } else {
            setLoading(true);
            try {
                const response = await resourceService.getByCategory(category);
                if (response.success) {
                    setResources(Array.isArray(response.data) ? response.data : []);
                    setActiveTab('category');
                }
            } catch (error) {
                toast.error('Failed to filter by category');
                setResources([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleShowMostViewed = async () => {
        setLoading(true);
        try {
            const response = await resourceService.getMostViewed();
            if (response.success) {
                setResources(Array.isArray(response.data) ? response.data : []);
                setActiveTab('mostviewed');
                setFilterType('All');
                setFilterCategory('All');
                setSearchQuery('');
            }
        } catch (error) {
            toast.error('Failed to load most viewed resources');
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const getResourceIcon = (type) => {
        const icons = {
            article: '📄',
            tip: '💡',
            guide: '📖',
            recipe: '👨‍🍳',
            infographic: '🎨',
            video: '🎥',
        };
        return icons[type] || '📚';
    };

    let displayedResources = resources;
    if (activeTab === 'all' && filterType === 'All' && filterCategory === 'All') {
        displayedResources = resources;
    }

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="text-primary-600" size={32} />
                        Resources & Learning
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Discover tips, guides, and recipes to reduce food waste and live sustainably
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                    <Button type="submit" className="flex-shrink-0">
                        <Search size={20} />
                        Search
                    </Button>
                </form>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={activeTab === 'all' ? 'primary' : 'secondary'}
                        onClick={() => {
                            setActiveTab('all');
                            setFilterType('All');
                            setFilterCategory('All');
                            setSearchQuery('');
                            fetchResources();
                        }}
                    >
                        All Resources
                    </Button>
                    <Button
                        variant={activeTab === 'mostviewed' ? 'primary' : 'secondary'}
                        onClick={handleShowMostViewed}
                    >
                        Most Viewed
                    </Button>
                </div>

                {/* Type Filter */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Filter by Type</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilterType('All')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterType === 'All'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            All Types
                        </button>
                        {RESOURCE_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleFilterType(type)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                                    filterType === type
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {getResourceIcon(type)} {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Filter by Category</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilterCategory('All')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterCategory === 'All'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            All Categories
                        </button>
                        {CATEGORIES.slice(0, 8).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFilterCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                                    filterCategory === cat
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                        <div className="w-full" />
                        {CATEGORIES.slice(8).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFilterCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
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

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-gray-600">Loading resources...</p>
                    </div>
                ) : displayedResources.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No resources found</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Try adjusting your filters or search terms
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedResources.map((resource) => (
                            <Card key={resource._id}>
                                <div className="flex flex-col h-full">
                                    {/* Resource Image */}
                                    {resource.imageUrl && (
                                        <div className="mb-4 -mx-6 -mt-6 h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden rounded-t-lg">
                                            <img
                                                src={resource.imageUrl}
                                                alt={resource.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                                                {getResourceIcon(resource.type)} {resource.type}
                                            </span>
                                        </div>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                            {resource.category}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 flex-1">
                                        {resource.description}
                                    </p>

                                    {/* Tags */}
                                    {resource.tags && resource.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {resource.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                            {resource.tags.length > 3 && (
                                                <span className="text-xs text-gray-600 px-2 py-1">
                                                    +{resource.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* View Button */}
                                    <Button className="w-full" variant="primary">
                                        <ExternalLink size={18} />
                                        Read More
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Resources;
