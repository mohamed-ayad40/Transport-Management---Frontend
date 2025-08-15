import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { trucksAPI, contractorsAPI, factoriesAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import {
    Truck,
    Search,
    ArrowLeft,
    Filter,
    Eye,
    Calendar,
    User,
    Building,
    Factory
} from 'lucide-react';

const TruckManagementPage = () => {
    const [trucks, setTrucks] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [factories, setFactories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterContractor, setFilterContractor] = useState('all');
    const [filterFactory, setFilterFactory] = useState('all');
    const [filterDate, setFilterDate] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

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
        } catch (error) {
            toast.error('خطأ في جلب البيانات');
        } finally {
            setLoading(false);
        }
    };

    const getContractorName = (contractorId) => {
        const contractor = contractors.find(c => c._id === contractorId);
        return contractor ? contractor.name : 'غير محدد';
    };

    const getFactoryName = (factoryId) => {
        const factory = factories.find(f => f._id === factoryId);
        return factory ? factory.name : 'غير محدد';
    };

    const getDateFilter = (date) => {
        const today = new Date();
        const truckDate = new Date(date);

        if (filterDate === 'today') {
            return truckDate.toDateString() === today.toDateString();
        } else if (filterDate === 'week') {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return truckDate >= weekAgo;
        } else if (filterDate === 'month') {
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return truckDate >= monthAgo;
        }
        return true;
    };

    const filteredTrucks = trucks.filter(truck => {
        const truckPlateText = String(truck.plateNumber || '');
        const matchesSearch = truckPlateText.includes(searchTerm) ||
            (truck.driverName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesContractor = filterContractor === 'all' || truck.contractorId === filterContractor;
        const matchesFactory = filterFactory === 'all' || truck.factoryId === filterFactory;
        const matchesDate = getDateFilter(truck.createdAt);

        return matchesSearch && matchesContractor && matchesFactory && matchesDate;
    });

    const contractorOptions = [
        { value: 'all', label: 'جميع المقاولين' },
        ...contractors.map(c => ({ value: c._id, label: c.name }))
    ];

    const factoryOptions = [
        { value: 'all', label: 'جميع المصانع' },
        ...factories.map(f => ({ value: f._id, label: f.name }))
    ];

    const dateOptions = [
        { value: 'all', label: 'جميع التواريخ' },
        { value: 'today', label: 'اليوم' },
        { value: 'week', label: 'آخر أسبوع' },
        { value: 'month', label: 'آخر شهر' }
    ];

    const getStatusColor = (truck) => {
        const now = new Date();
        const truckDate = new Date(truck.createdAt);
        const hoursDiff = (now - truckDate) / (1000 * 60 * 60);

        if (hoursDiff <= 1) return 'bg-green-100 text-green-800';
        if (hoursDiff <= 24) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (truck) => {
        const now = new Date();
        const truckDate = new Date(truck.createdAt);
        const hoursDiff = (now - truckDate) / (1000 * 60 * 60);

        if (hoursDiff <= 1) return 'جديد';
        if (hoursDiff <= 24) return 'اليوم';
        return 'قديم';
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
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="mr-3"
                            >
                                <ArrowLeft className="w-4 h-4 ml-1" />
                                رجوع
                            </Button>
                            <div className="bg-orange-600 p-2 rounded-lg">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mr-3">
                                إدارة العربيات
                            </h1>
                        </div>

                        <div className="text-sm text-gray-600">
                            إجمالي العربيات: {trucks.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <Card title="فلاتر البحث" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                البحث
                            </label>
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="البحث برقم اللوحة أو اسم السائق"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                المقاول
                            </label>
                            <Select
                                options={contractorOptions}
                                value={filterContractor}
                                onChange={(e) => setFilterContractor(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                المصنع
                            </label>
                            <Select
                                options={factoryOptions}
                                value={filterFactory}
                                onChange={(e) => setFilterFactory(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                التاريخ
                            </label>
                            <Select
                                options={dateOptions}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Trucks List */}
                <Card title={`العربيات (${filteredTrucks.length})`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        العربية
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        السائق
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        المقاول
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        المصنع
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        التاريخ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTrucks.map((truck) => (
                                    <tr key={truck._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                        <Truck className="w-5 h-5 text-orange-600" />
                                                    </div>
                                                </div>
                                                <div className="mr-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {truck.plateNumber}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {truck.truckType || 'عربية عادية'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 text-gray-400 ml-2" />
                                                <span className="text-sm text-gray-900">
                                                    {truck.driverName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building className="w-4 h-4 text-gray-400 ml-2" />
                                                <span className="text-sm text-gray-900">
                                                    {getContractorName(truck.contractorId)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Factory className="w-4 h-4 text-gray-400 ml-2" />
                                                <span className="text-sm text-gray-900">
                                                    {getFactoryName(truck.factoryId)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(truck)}`}>
                                                {getStatusText(truck)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 ml-2" />
                                                {new Date(truck.createdAt).toLocaleDateString('ar-EG')}
                                                <br />
                                                <span className="text-xs text-gray-400">
                                                    {new Date(truck.createdAt).toLocaleTimeString('ar-EG')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredTrucks.length === 0 && (
                        <div className="text-center py-8">
                            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">لا توجد عربيات</p>
                        </div>
                    )}
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <Card>
                        <div className="text-center">
                            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Truck className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                عربيات اليوم
                            </h3>
                            <p className="text-3xl font-bold text-green-600">
                                {trucks.filter(truck => {
                                    const today = new Date();
                                    const truckDate = new Date(truck.createdAt);
                                    return truckDate.toDateString() === today.toDateString();
                                }).length}
                            </p>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                عربيات الأسبوع
                            </h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {trucks.filter(truck => {
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    const truckDate = new Date(truck.createdAt);
                                    return truckDate >= weekAgo;
                                }).length}
                            </p>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Truck className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                إجمالي العربيات
                            </h3>
                            <p className="text-3xl font-bold text-purple-600">
                                {trucks.length}
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TruckManagementPage; 