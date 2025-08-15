import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { statsAPI, trucksAPI, contractorsAPI, factoriesAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import {
    BarChart3,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Calendar,
    Truck,
    Building,
    Factory,
    Users
} from 'lucide-react';

const StatisticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [trucks, setTrucks] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [factories, setFactories] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [selectedContractor, setSelectedContractor] = useState('all');
    const [selectedFactory, setSelectedFactory] = useState('all');

    useEffect(() => {
        fetchData();
    }, [selectedPeriod, selectedContractor, selectedFactory]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [trucksRes, contractorsRes, factoriesRes] = await Promise.all([
                trucksAPI.getAll(),
                contractorsAPI.getAll(),
                factoriesAPI.getAll(),
            ]);

            setTrucks(trucksRes.data.data);
            setContractors(contractorsRes.data.data);
            setFactories(factoriesRes.data.data);

            // تحليل البيانات
            analyzeData();
        } catch (error) {
            toast.error('خطأ في جلب البيانات');
        } finally {
            setLoading(false);
        }
    };

    const analyzeData = () => {
        const now = new Date();
        const periodDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
        const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

        let filteredTrucks = trucks.filter(truck => {
            const truckDate = new Date(truck.createdAt);
            return truckDate >= startDate;
        });

        if (selectedContractor !== 'all') {
            filteredTrucks = filteredTrucks.filter(truck => truck.contractorId === selectedContractor);
        }

        if (selectedFactory !== 'all') {
            filteredTrucks = filteredTrucks.filter(truck => truck.factoryId === selectedFactory);
        }

        // إحصائيات حسب اليوم
        const dailyStats = {};
        for (let i = 0; i < periodDays; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            dailyStats[dateStr] = 0;
        }

        filteredTrucks.forEach(truck => {
            const dateStr = new Date(truck.createdAt).toISOString().split('T')[0];
            if (dailyStats[dateStr] !== undefined) {
                dailyStats[dateStr]++;
            }
        });

        // إحصائيات المقاولين
        const contractorStats = {};
        contractors.forEach(contractor => {
            const contractorTrucks = filteredTrucks.filter(truck => truck.contractorId === contractor._id);
            contractorStats[contractor.name] = contractorTrucks.length;
        });

        // إحصائيات المصانع
        const factoryStats = {};
        factories.forEach(factory => {
            const factoryTrucks = filteredTrucks.filter(truck => truck.factoryId === factory._id);
            factoryStats[factory.name] = factoryTrucks.length;
        });

        setStats({
            totalTrucks: filteredTrucks.length,
            dailyStats,
            contractorStats,
            factoryStats,
            averagePerDay: filteredTrucks.length / periodDays,
            maxDay: Math.max(...Object.values(dailyStats)),
            minDay: Math.min(...Object.values(dailyStats))
        });
    };

    const periodOptions = [
        { value: 'week', label: 'آخر أسبوع' },
        { value: 'month', label: 'آخر شهر' },
        { value: 'year', label: 'آخر سنة' }
    ];

    const contractorOptions = [
        { value: 'all', label: 'جميع المقاولين' },
        ...contractors.map(c => ({ value: c._id, label: c.name }))
    ];

    const factoryOptions = [
        { value: 'all', label: 'جميع المصانع' },
        ...factories.map(f => ({ value: f._id, label: f.name }))
    ];

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="loading"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="mr-3"
                            >
                                <ArrowLeft className="w-4 h-4 ml-1" />
                                رجوع
                            </Button>
                            <div className="bg-red-600 p-2 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mr-3">
                                الإحصائيات التفصيلية
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <Card title="فلاتر الإحصائيات" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الفترة الزمنية
                            </label>
                            <Select
                                options={periodOptions}
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                المقاول
                            </label>
                            <Select
                                options={contractorOptions}
                                value={selectedContractor}
                                onChange={(e) => setSelectedContractor(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                المصنع
                            </label>
                            <Select
                                options={factoryOptions}
                                value={selectedFactory}
                                onChange={(e) => setSelectedFactory(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center">
                            <Truck className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">إجمالي العربيات</p>
                                <p className="text-2xl font-bold">{stats.totalTrucks || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">المتوسط اليومي</p>
                                <p className="text-2xl font-bold">{stats.averagePerDay?.toFixed(1) || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">أعلى يوم</p>
                                <p className="text-2xl font-bold">{stats.maxDay || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <div className="flex items-center">
                            <TrendingDown className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">أقل يوم</p>
                                <p className="text-2xl font-bold">{stats.minDay || 0}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Chart */}
                    <Card title="العربيات حسب اليوم">
                        <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
                            {Object.entries(stats.dailyStats || {}).map(([date, count]) => (
                                <div key={date} className="flex flex-col items-center">
                                    <div
                                        className="bg-primary-500 rounded-t w-8"
                                        style={{ height: `${Math.max(count * 10, 4)}px` }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-2">
                                        {formatDate(date)}
                                    </span>
                                    <span className="text-xs font-medium text-gray-900">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Contractor Stats */}
                    <Card title="العربيات حسب المقاول">
                        <div className="space-y-3">
                            {Object.entries(stats.contractorStats || {})
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([contractor, count]) => (
                                    <div key={contractor} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Building className="w-4 h-4 text-gray-400 ml-2" />
                                            <span className="text-sm text-gray-900">{contractor}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                                                <div
                                                    className="bg-primary-500 h-2 rounded-full"
                                                    style={{ width: `${(count / Math.max(...Object.values(stats.contractorStats || {}))) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-8 text-left">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </Card>
                </div>

                {/* Factory Stats */}
                <Card title="العربيات حسب المصنع">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(stats.factoryStats || {})
                            .sort(([, a], [, b]) => b - a)
                            .map(([factory, count]) => (
                                <div key={factory} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Factory className="w-5 h-5 text-gray-400 ml-2" />
                                            <span className="text-sm font-medium text-gray-900">{factory}</span>
                                        </div>
                                        <span className="text-lg font-bold text-primary-600">{count}</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-500 h-2 rounded-full"
                                                style={{ width: `${(count / Math.max(...Object.values(stats.factoryStats || {}))) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsPage; 