import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { contractorsAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import {
    Building,
    Plus,
    Edit,
    Trash2,
    Search,
    ArrowLeft,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';

const ContractorManagementPage = () => {
    const [contractors, setContractors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingContractor, setEditingContractor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        fetchContractors();
    }, []);

    const fetchContractors = async () => {
        try {
            setLoading(true);
            const response = await contractorsAPI.getAll();
            setContractors(response.data.data);
        } catch (error) {
            toast.error('خطأ في جلب المقاولين');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editingContractor) {
                await contractorsAPI.update(editingContractor._id, data);
                toast.success('تم تحديث المقاول بنجاح');
            } else {
                await contractorsAPI.create(data);
                toast.success('تم إضافة المقاول بنجاح');
            }
            reset();
            setShowForm(false);
            setEditingContractor(null);
            fetchContractors();
        } catch (error) {
            toast.error(error.response?.data?.message || 'خطأ في العملية');
        }
    };

    const handleEdit = (contractor) => {
        setEditingContractor(contractor);
        setValue('name', contractor.name);
        setValue('phone', contractor.phone);
        setValue('email', contractor.email);
        setValue('address', contractor.address);
        setShowForm(true);
    };

    const handleDelete = async (contractorId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المقاول؟')) return;

        try {
            await contractorsAPI.delete(contractorId);
            toast.success('تم حذف المقاول بنجاح');
            fetchContractors();
        } catch (error) {
            toast.error('خطأ في حذف المقاول');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingContractor(null);
        reset();
    };

    const filteredContractors = contractors.filter(contractor =>
        contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.phone.includes(searchTerm) ||
        contractor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Building className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mr-3">
                                إدارة المقاولين
                            </h1>
                        </div>

                        {!showForm && (
                            <Button onClick={() => setShowForm(true)}>
                                <Plus className="w-4 h-4 ml-2" />
                                إضافة مقاول جديد
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm ? (
                    <Card title={editingContractor ? 'تعديل المقاول' : 'إضافة مقاول جديد'}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="اسم المقاول"
                                    placeholder="اسم المقاول"
                                    error={errors.name?.message}
                                    {...register('name', { required: 'اسم المقاول مطلوب' })}
                                />

                                <Input
                                    label="رقم الهاتف"
                                    placeholder="رقم الهاتف"
                                    error={errors.phone?.message}
                                    {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                                />

                                <Input
                                    label="البريد الإلكتروني"
                                    type="email"
                                    placeholder="example@email.com"
                                    error={errors.email?.message}
                                    {...register('email', {
                                        required: 'البريد الإلكتروني مطلوب',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'بريد إلكتروني غير صحيح'
                                        }
                                    })}
                                />

                                <Input
                                    label="العنوان"
                                    placeholder="عنوان المقاول"
                                    error={errors.address?.message}
                                    {...register('address', { required: 'العنوان مطلوب' })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 space-x-reverse">
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    إلغاء
                                </Button>
                                <Button type="submit">
                                    {editingContractor ? 'تحديث' : 'إضافة'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <>
                        {/* Search */}
                        <div className="mb-6">
                            <Card>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البحث
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="البحث بالاسم أو الهاتف أو البريد الإلكتروني"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Contractors List */}
                        <Card title={`المقاولين (${filteredContractors.length})`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredContractors.map((contractor) => (
                                    <div key={contractor._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <Building className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex space-x-2 space-x-reverse">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(contractor)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(contractor._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {contractor.name}
                                        </h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 ml-2" />
                                                <span>{contractor.phone}</span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="w-4 h-4 ml-2" />
                                                <span>{contractor.email}</span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 ml-2" />
                                                <span>{contractor.address}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">تاريخ الإنشاء:</span>
                                                <span className="text-gray-900">
                                                    {new Date(contractor.createdAt).toLocaleDateString('ar-EG')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredContractors.length === 0 && (
                                <div className="text-center py-8">
                                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">لا يوجد مقاولين</p>
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContractorManagementPage; 