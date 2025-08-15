import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { usersAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Search,
    ArrowLeft,
    Shield,
    User
} from 'lucide-react';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAll();
            setUsers(response.data.data);
        } catch (error) {
            toast.error('خطأ في جلب المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingUser) {
                await usersAPI.update(editingUser._id, data);
                toast.success('تم تحديث المستخدم بنجاح');
            } else {
                await usersAPI.create(data);
                toast.success('تم إضافة المستخدم بنجاح');
            }
            reset();
            setShowForm(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'خطأ في العملية');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setValue('name', user.name);
        setValue('username', user.username);
        setValue('role', user.role);
        setShowForm(true);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

        try {
            await usersAPI.delete(userId);
            toast.success('تم حذف المستخدم بنجاح');
            fetchUsers();
        } catch (error) {
            toast.error('خطأ في حذف المستخدم');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUser(null);
        reset();
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const roleOptions = [
        { value: 'admin', label: 'أدمن' },
        { value: 'military', label: 'عسكري' },
    ];

    const filterOptions = [
        { value: 'all', label: 'جميع المستخدمين' },
        { value: 'admin', label: 'الأدمن' },
        { value: 'military', label: 'العساكر' },
    ];

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
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mr-3">
                                إدارة المستخدمين
                            </h1>
                        </div>

                        {!showForm && (
                            <Button onClick={() => setShowForm(true)}>
                                <Plus className="w-4 h-4 ml-2" />
                                إضافة مستخدم جديد
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm ? (
                    <Card title={editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="الاسم"
                                    placeholder="اسم المستخدم"
                                    error={errors.name?.message}
                                    {...register('name', { required: 'الاسم مطلوب' })}
                                />

                                <Input
                                    label="اسم المستخدم"
                                    placeholder="username"
                                    error={errors.username?.message}
                                    {...register('username', { required: 'اسم المستخدم مطلوب' })}
                                />

                                <Input
                                    label="كلمة المرور"
                                    type="password"
                                    placeholder="كلمة المرور"
                                    error={errors.password?.message}
                                    {...register('password', {
                                        required: !editingUser ? 'كلمة المرور مطلوبة' : false,
                                        minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
                                    })}
                                />

                                <Select
                                    label="الدور"
                                    options={roleOptions}
                                    error={errors.role?.message}
                                    {...register('role', { required: 'الدور مطلوب' })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 space-x-reverse">
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    إلغاء
                                </Button>
                                <Button type="submit">
                                    {editingUser ? 'تحديث' : 'إضافة'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="mb-6">
                            <Card>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            البحث
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="البحث بالاسم أو اسم المستخدم"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تصفية حسب الدور
                                        </label>
                                        <Select
                                            options={filterOptions}
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Users List */}
                        <Card title={`المستخدمين (${filteredUsers.length})`}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المستخدم
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الدور
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                تاريخ الإنشاء
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                                {user.role === 'admin' ? (
                                                                    <Shield className="w-5 h-5 text-primary-600" />
                                                                ) : (
                                                                    <User className="w-5 h-5 text-primary-600" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mr-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role === 'admin' ? 'أدمن' : 'عسكري'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2 space-x-reverse">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(user)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleDelete(user._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">لا يوجد مستخدمين</p>
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage; 