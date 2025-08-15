import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { trucksAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import {
    Truck,
    Plus,
    Edit,
    Eye,
    LogOut,
    Calendar,
    TrendingUp,
    User,
    Clock
} from 'lucide-react';
import Header from '../components/Header';

const MilitaryDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    // const [myTrucks, setMyTrucks] = useState([]);
    // const [stats, setStats] = useState({
    //     totalTrucks: 0,
    //     todayTrucks: 0,
    //     weekTrucks: 0,
    //     monthTrucks: 0
    // });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'military') {
            navigate('/login');
            return;
        }

        // you should remove this line because we delete last card in the page
        // but when i delete this function the loading is infinite
        fetchMyData();
    }, [user, navigate]);

    const fetchMyData = async () => {
        try {
            setLoading(true);

            // جلب عربياتي
            // const trucksRes = await trucksAPI.getMyTrucks();
            // const trucks = trucksRes.data.data;
            // setMyTrucks(trucks);

            // جلب إحصائياتي
            // const statsRes = await trucksAPI.getMyStats();
            // setStats(statsRes.data.data);

        } catch (error) {
            console.error('Error fetching military data:', error);
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

    const handleRegisterTruck = () => {
        navigate('/new-truck');
    };

    const handleViewMyTrucks = () => {
        // يمكن إضافة صفحة منفصلة لعرض عربيات العسكري
        toast.info('سيتم إضافة صفحة عربياتي قريباً');
    };

    const handleEditTruck = (truck) => {
        // التحقق من أن العربية مسجلة خلال 24 ساعة
        const now = new Date();
        const truckDate = new Date(truck.createdAt);
        const hoursDiff = (now - truckDate) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            toast.error('لا يمكن تعديل العربية بعد مرور 24 ساعة');
            return;
        }

        toast.info('سيتم إضافة تعديل العربية قريباً');
    };

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
            <Header user={user} handleLogout={handleLogout} />

            <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center">
                            <Truck className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">إجمالي عربياتي</p>
                                <p className="text-2xl font-bold">{stats.totalTrucks || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">عربيات اليوم</p>
                                <p className="text-2xl font-bold">{stats.todayTrucks || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">عربيات الأسبوع</p>
                                <p className="text-2xl font-bold">{stats.weekTrucks || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <div className="flex items-center">
                            <Clock className="w-8 h-8 ml-3" />
                            <div>
                                <p className="text-sm opacity-90">عربيات الشهر</p>
                                <p className="text-2xl font-bold">{stats.monthTrucks || 0}</p>
                            </div>
                        </div>
                    </Card>
                </div> */}

                {/* Quick Actions */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-8"
                >
                    <Card>
                        <div className="text-center">
                            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Plus className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                تسجيل عربية جديدة
                            </h3>
                            <p className="text-gray-600 mb-4">
                                تسجيل عربية جديدة في النظام
                            </p>
                            <Button onClick={handleRegisterTruck} className="w-full">
                                <Plus className="w-4 h-4 ml-2" />
                                تسجيل عربية
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="text-center">
                            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Eye className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                عربياتي
                            </h3>
                            <p className="text-gray-600 mb-4">
                                عرض وتعديل عربياتي المسجلة
                            </p>
                            <Button onClick={handleViewMyTrucks} className="w-full">
                                <Eye className="w-4 h-4 ml-2" />
                                عرض عربياتي
                            </Button>
                        </div>
                    </Card>

                    {/* <Card>
                        <div className="text-center">
                            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Edit className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                تعديل عربياتي
                            </h3>
                            <p className="text-gray-600 mb-4">
                                تعديل عربياتي خلال 24 ساعة
                            </p>
                            <Button variant="outline" className="w-full">
                                <Edit className="w-4 h-4 ml-2" />
                                تعديل عربياتي
                            </Button>
                        </div>
                    </Card> */}
                </div>

                {/* Recent Trucks */}
                {/* <Card title="آخر عربياتي" subtitle="آخر 5 عربيات مسجلة">
                    <div className="space-y-4">
                        {myTrucks.slice(0, 5).map((truck) => (
                            <div key={truck._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="bg-orange-100 p-2 rounded-lg ml-3">
                                        <Truck className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{truck.plateNumber}</p>
                                        <p className="text-sm text-gray-600">{truck.driverName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(truck)}`}>
                                        {getStatusText(truck)}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditTruck(truck)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {myTrucks.length === 0 && (
                            <div className="text-center py-8">
                                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">لا توجد عربيات مسجلة</p>
                            </div>
                        )}
                    </div>
                </Card> */}
            </div>
        </div>
    );
};

export default MilitaryDashboard; 