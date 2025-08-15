import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    usersAPI,
    contractorsAPI,
    factoriesAPI,
    trucksAPI,
    statsAPI
} from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import {
    Users,
    Truck,
    Building,
    Factory,
    BarChart3,
    LogOut,
    Plus,
    Settings,
    DoorOpen,
    Eye
} from 'lucide-react';
import Header from '../components/Header';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalContractors: 0,
        totalFactories: 0,
        totalTrucks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }

        fetchDashboardData();
    }, [user, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // جلب الإحصائيات
            const [usersRes, contractorsRes, factoriesRes, trucksRes] = await Promise.all([
                usersAPI.getAll(),
                contractorsAPI.getAll(),
                factoriesAPI.getAll(),
                trucksAPI.getAll()
            ]);

            setStats({
                totalUsers: usersRes.data.data.length,
                totalContractors: contractorsRes.data.data.length,
                totalFactories: factoriesRes.data.data.length,
                totalTrucks: trucksRes.data.data.length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('خطأ في جلب البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('تم تسجيل الخروج بنجاح');
    };

    const handleManageUsers = () => {
        navigate('/admin/users');
    };

    const handleManageContractors = () => {
        navigate('/admin/contractors');
    };

    const handleManageFactories = () => {
        navigate('/admin/factories');
    };
    const handleManageGates = () => {
        navigate('/admin/gates');
    };

    const handleViewTrucks = () => {
        navigate('/admin/trucks');
    };

    const handleViewStats = () => {
        navigate('/admin/statistics');
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
            <Header user={user} handleLogout={handleLogout} />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">إجمالي المستخدمين</p>
                                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="flex items-center">
                            <Building className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">إجمالي المقاولين</p>
                                <p className="text-2xl font-bold">{stats.totalContractors}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center">
                            <Factory className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">إجمالي المصانع</p>
                                <p className="text-2xl font-bold">{stats.totalFactories}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <div className="flex items-center">
                            <Truck className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">إجمالي العربيات</p>
                                <p className="text-2xl font-bold">{stats.totalTrucks}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <div className="text-center">
                            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                إدارة المستخدمين
                            </h3>
                            <p className="text-gray-600 mb-4">
                                إضافة وتعديل وحذف المستخدمين والعساكر
                            </p>
                            <Button onClick={handleManageUsers} className="w-full">
                                <Plus className="w-4 h-4 ml-2" />
                                إدارة المستخدمين
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Building className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                إدارة المقاولين
                            </h3>
                            <p className="text-gray-600 mb-4">
                                إضافة وتعديل وحذف المقاولين
                            </p>
                            <Button onClick={handleManageContractors} className="w-full">
                                <Plus className="w-4 h-4 ml-2" />
                                إدارة المقاولين
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Factory className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                إدارة المصانع
                            </h3>
                            <p className="text-gray-600 mb-4">
                                إضافة وتعديل وحذف المصانع
                            </p>
                            <Button onClick={handleManageFactories} className="w-full">
                                <Plus className="w-4 h-4 ml-2" />
                                إدارة المصانع
                            </Button>
                        </div>
                    </Card>

                    {/* ادارة البوابات */}
                    <Card>
                        <div className="text-center">
                            <div className="bg-teal-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <DoorOpen className="w-8 h-8 text-teal-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                إدارة البوابات
                            </h3>
                            <p className="text-gray-600 mb-4">
                                إضافة وتعديل وحذف البوابات
                            </p>
                            <Button
                                onClick={handleManageGates}
                                className="w-full">
                                <Plus className="w-4 h-4 ml-2" />
                                إدارة البوابات
                            </Button>
                        </div>
                    </Card>



                    <Card>
                        <div className="text-center">
                            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Truck className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                عرض العربيات
                            </h3>
                            <p className="text-gray-600 mb-4">
                                عرض وإدارة جميع العربيات المسجلة
                            </p>
                            <Button onClick={handleViewTrucks} className="w-full">
                                <Eye className="w-4 h-4 ml-2" />
                                عرض العربيات
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                الإحصائيات التفصيلية
                            </h3>
                            <p className="text-gray-600 mb-4">
                                رسوم بيانية وإحصائيات مفصلة
                            </p>
                            <Button onClick={handleViewStats} className="w-full">
                                <BarChart3 className="w-4 h-4 ml-2" />
                                عرض الإحصائيات
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-gray-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Settings className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                إعدادات النظام
                            </h3>
                            <p className="text-gray-600 mb-4">
                                إعدادات النظام والتكوين
                            </p>
                            <Button variant="outline" className="w-full">
                                <Settings className="w-4 h-4 ml-2" />
                                الإعدادات
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card title="النشاط الأخير" subtitle="آخر العمليات في النظام">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                                <span className="text-sm text-gray-600">تم تسجيل دخول الأدمن</span>
                            </div>
                            <span className="text-xs text-gray-500">الآن</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                                <span className="text-sm text-gray-600">تم إضافة مقاول جديد</span>
                            </div>
                            <span className="text-xs text-gray-500">منذ 5 دقائق</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                                <span className="text-sm text-gray-600">تم تسجيل عربية جديدة</span>
                            </div>
                            <span className="text-xs text-gray-500">منذ 10 دقائق</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard; 