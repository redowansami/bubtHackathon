import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, TrendingUp, Calendar, Package, Zap, Clock, CheckCircle, AlertOctagon } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import inventoryService from '../services/inventoryService';
import riskPredictionService from '../services/riskPredictionService';
import { formatDate } from '../utils/constants';

export const RiskPrediction = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({
        criticalCount: 0,
        highRiskCount: 0,
        totalItems: 0,
    });
    const [riskDistribution, setRiskDistribution] = useState({});

    useEffect(() => {
        fetchRiskData();
    }, []);

    const fetchRiskData = async () => {
        setLoading(true);
        try {
            // Fetch inventory
            const inventoryResponse = await inventoryService.getInventory();
            if (inventoryResponse.success && Array.isArray(inventoryResponse.data)) {
                // Calculate risk scores for all items
                const itemsWithRisk = riskPredictionService.sortByRiskScore(inventoryResponse.data);
                setItems(itemsWithRisk);

                // Calculate summary
                const criticalCount = itemsWithRisk.filter(
                    (item) => riskPredictionService.getRiskLevel(item.riskScore) === 'CRITICAL'
                ).length;
                const highRiskCount = itemsWithRisk.filter(
                    (item) => riskPredictionService.getRiskLevel(item.riskScore) === 'HIGH'
                ).length;

                // Calculate risk distribution
                const distribution = {
                    critical: itemsWithRisk.filter((item) => riskPredictionService.getRiskLevel(item.riskScore) === 'CRITICAL').length,
                    high: itemsWithRisk.filter((item) => riskPredictionService.getRiskLevel(item.riskScore) === 'HIGH').length,
                    medium: itemsWithRisk.filter((item) => riskPredictionService.getRiskLevel(item.riskScore) === 'MEDIUM').length,
                    low: itemsWithRisk.filter((item) => riskPredictionService.getRiskLevel(item.riskScore) === 'LOW').length,
                    minimal: itemsWithRisk.filter((item) => riskPredictionService.getRiskLevel(item.riskScore) === 'MINIMAL').length,
                };

                setSummary({
                    criticalCount,
                    highRiskCount,
                    totalItems: itemsWithRisk.length,
                });
                setRiskDistribution(distribution);
            } else {
                toast.error('Failed to load inventory data');
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching risk data:', error);
            toast.error('Failed to fetch risk prediction data');
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const RiskBadge = ({ level, score }) => {
        const bgColor = riskPredictionService.getRiskLevelBgColor(level);
        const textColor = riskPredictionService.getRiskLevelColor(level);
        const icon = riskPredictionService.getRiskLevelIcon(level);

        return (
            <div
                className="px-4 py-2 rounded-full inline-flex items-center gap-3 font-bold text-base"
                style={{ backgroundColor: bgColor }}
            >
                <span className="text-3xl leading-none">{icon}</span>
                <span style={{ color: textColor }} className="font-semibold text-sm">
                    {level} ({score.toFixed(1)})
                </span>
            </div>
        );
    };

    const RiskScoreBar = ({ score }) => {
        const percentage = Math.min(100, (score / 100) * 100);
        let barColor = '#10b981'; // minimal

        if (score >= 80) barColor = '#dc2626'; // critical
        else if (score >= 60) barColor = '#f59e0b'; // high
        else if (score >= 40) barColor = '#eab308'; // medium
        else if (score >= 20) barColor = '#84cc16'; // low

        return (
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: barColor,
                    }}
                ></div>
            </div>
        );
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex items-center gap-4">
                <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: color, opacity: 0.1 }}
                >
                    <Icon size={24} style={{ color }} />
                </div>
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <ProtectedRoute>
            <Layout>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Risk Prediction</h1>
                    <p className="text-gray-600 mt-2">
                        AI-powered analysis of your inventory items based on expiration dates, categories, and consumption patterns
                    </p>
                </div>

                {/* Summary Statistics */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            icon={AlertOctagon}
                            label="Critical Items"
                            value={summary.criticalCount}
                            color="#dc2626"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            label="High Risk Items"
                            value={summary.highRiskCount}
                            color="#f59e0b"
                        />
                        <StatCard
                            icon={Package}
                            label="Total Items"
                            value={summary.totalItems}
                            color="#3b82f6"
                        />
                    </div>
                )}

                {/* Risk Distribution */}
                {!loading && items.length > 0 && (
                    <Card className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Zap size={24} className="text-yellow-500" />
                            Risk Distribution
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { level: 'CRITICAL', count: riskDistribution.critical, color: '#dc2626', icon: AlertOctagon },
                                { level: 'HIGH', count: riskDistribution.high, color: '#f59e0b', icon: AlertTriangle },
                                { level: 'MEDIUM', count: riskDistribution.medium, color: '#eab308', icon: AlertCircle },
                                { level: 'LOW', count: riskDistribution.low, color: '#84cc16', icon: Clock },
                                { level: 'MINIMAL', count: riskDistribution.minimal, color: '#10b981', icon: CheckCircle },
                            ].map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={item.level} className="text-center p-4 bg-gray-50 rounded-lg border-2" style={{ borderColor: item.color }}>
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-5xl font-bold"
                                            style={{ backgroundColor: item.color, opacity: 0.15 }}
                                        >
                                            {riskPredictionService.getRiskLevelIcon(item.level)}
                                        </div>
                                        <p style={{ color: item.color }} className="text-lg font-bold">
                                            {item.count}
                                        </p>
                                        <p style={{ color: item.color }} className="text-sm font-bold">
                                            {item.level}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                )}

                {/* Items Risk Analysis */}
                {loading ? (
                    <Card>
                        <div className="text-center py-12">
                            <p className="text-gray-600">Analyzing inventory items...</p>
                        </div>
                    </Card>
                ) : items.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <Package size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No items in inventory</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Add items to your inventory to see risk predictions
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp size={24} className="text-blue-600" />
                            Items Ranked by Risk
                        </h2>
                        {items.map((item) => {
                            const riskLevel = riskPredictionService.getRiskLevel(item.riskScore);
                            const recommendedAction = riskPredictionService.getRecommendedAction(
                                riskLevel,
                                item
                            );

                            return (
                                <Card key={item._id} className="hover:shadow-lg transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left side - Item info */}
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                        <Package size={20} className="text-blue-600" />
                                                        {item.itemName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                                                </div>
                                                <RiskBadge level={riskLevel} score={item.riskScore} />
                                            </div>

                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={16} className="text-purple-500" />
                                                    <span>Expires: {formatDate(item.expiryDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Zap size={16} className="text-yellow-500" />
                                                    <span>Quantity: {item.quantity} units</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Risk analysis */}
                                        <div>
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                                        <TrendingUp size={16} className="text-blue-600" />
                                                        Risk Score
                                                    </span>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {item.riskScore.toFixed(1)}/100
                                                    </span>
                                                </div>
                                                <RiskScoreBar score={item.riskScore} />
                                            </div>

                                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                                <p className="text-sm text-blue-900">
                                                    <span className="font-semibold">💡 Recommendation: </span>
                                                    {recommendedAction}
                                                </p>
                                            </div>

                                            <div className="mt-3 text-xs text-gray-600">
                                                <p className="flex items-center gap-1">
                                                    <Clock size={14} className="text-green-600" />
                                                    Days to expiry:{' '}
                                                    <span
                                                        className={`font-semibold ${
                                                            item.expirationDays <= 3
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        }`}
                                                    >
                                                        {item.expirationDays} days
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Info Section */}
                <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp size={24} className="text-blue-600" />
                            How Risk Scores Are Calculated
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p>
                                <span className="font-semibold">📊 Risk Score Formula:</span> Our algorithm combines multiple factors to calculate a score from 0-100:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>
                                    <span className="font-semibold">Days to Expiry (50%):</span> Items closer to expiration date have higher risk
                                </li>
                                <li>
                                    <span className="font-semibold">Category (30%):</span> Perishable items (Dairy, Protein) have higher inherent risk
                                </li>
                                <li>
                                    <span className="font-semibold">Quantity (20%):</span> Lower quantity items are prioritized to prevent waste
                                </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="text-xs text-gray-600">
                                    💡 <span className="italic">Higher scores indicate higher priority for immediate consumption</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </Layout>
        </ProtectedRoute>
    );
};

export default RiskPrediction;
