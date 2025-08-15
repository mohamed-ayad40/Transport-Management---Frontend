import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { trucksAPI, contractorsAPI, factoriesAPI, gatesAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { use } from 'react';

const CreateNewTruck = () => {
    const [loading, setLoading] = useState(false);
    const [contractors, setContractors] = useState([]);
    const [factories, setFactories] = useState([]);
    const [gates, setGates] = useState([]);
    const [successCount, setSuccessCount] = useState(0);
    const [lastTruck, setLastTruck] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm();

    // جلب المقاولين والمصانع
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contractorsRes, factoriesRes, gatesRes] = await Promise.all([
                    contractorsAPI.getAll(),
                    factoriesAPI.getAll(),
                    gatesAPI.getAll(),
                ]);
                setContractors(contractorsRes.data.data);
                setFactories(factoriesRes.data.data);
                setGates(gatesRes.data.data);
            } catch (error) {   
                toast.error('خطأ في جلب البيانات');
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log("data",data)
            setLoading(true);
            const response = await trucksAPI.registerNewTruck(data);
            // console.log(response)
            console.log(response.data.data)
            // console.log(response)
            setLastTruck(response.data.data);   
            setSuccessCount(prev => prev + 1);
            toast.success('تم تسجيل العربية بنجاح');
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'خطأ في تسجيل العربية');
        } finally {
            setLoading(false);
        }
    };

    const contractorOptions = contractors.map(c => ({
        value: c._id,
        label: c.name,
    }));

    const factoryOptions = factories.map(f => ({
        value: f._id,
        label: f.name,
    }));
    const gateOptions = gates.map(g => ({
        value: g._id,
        label: g.name,
    }))
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-full">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        تسجيل عربية جديدة
                    </h1>
                    {/* <p className="text-gray-600">
                        موظف البوابة - تسجيل سريع بدون دخول
                    </p> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card title="بيانات العربية" className="mb-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="رقم اللوحة"
                                        type="number"
                                        placeholder="أدخل رقم اللوحة"
                                        error={errors.plateNumber?.message}
                                        {...register('plateNumber', {
                                            required: 'رقم اللوحة مطلوب',
                                            valueAsNumber: true,
                                            validate: (v) => Number.isFinite(v) || 'رقم اللوحة غير صحيح',
                                        })}
                                    />

                                    <Select
                                        label="المقاول"
                                        options={contractorOptions}
                                        error={errors.contractorId?.message}
                                        {...register('contractorId', {
                                            required: 'المقاول مطلوب',
                                        })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="المصنع"
                                        options={factoryOptions} // from here
                                        error={errors.factoryId?.message}
                                        {...register('factoryId', {
                                            required: 'المصنع مطلوب',
                                        })}
                                    />

                                    <Input
                                        label="رقم كارتة المصنع"
                                        placeholder="أدخل رقم كارتة المصنع"
                                        type="number"
                                        error={errors.factoryCardNumber?.message}
                                        {...register('factoryCardNumber', {
                                            required: 'رقم كارتة المصنع مطلوب',
                                            valueAsNumber: true,
                                            validate: (v) => Number.isFinite(v) || 'رقم الكارتة غير صحيح',
                                        })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="رقم كارتة الجهاز"
                                        placeholder="أدخل رقم كارتة الجهاز"
                                        type="number"
                                        error={errors.deviceCardNumber?.message}
                                        {...register('deviceCardNumber', {
                                            required: 'رقم كارتة الجهاز مطلوب',
                                            valueAsNumber: true,
                                            validate: (v) => Number.isFinite(v) || 'رقم الكارتة غير صحيح',
                                        })}
                                    />

                                    {/* <Input
                                        label="رقم البوابة"
                                        placeholder="أدخل رقم البوابة"
                                        defaultValue="gate-1"
                                        error={errors.gateId?.message}
                                        {...register('gateId', {
                                            required: 'رقم البوابة مطلوب',
                                        })}
                                    /> */}
                                    <Select
                                        label="رقم البوابة"
                                        options={gateOptions}
                                        error={errors.factoryId?.message}
                                        {...register('gateId', {
                                            required: 'المصنع مطلوب',
                                        })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    loading={loading}
                                    disabled={loading}
                                >
                                    تسجيل العربية
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                        <Card title="إحصائيات اليوم">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">العربيات المسجلة:</span>
                                    <span className="font-bold text-2xl text-primary-600">
                                        {successCount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">آخر عربية:</span>
                                    <span className="font-medium text-sm">
                                        {lastTruck ? lastTruck.plateNumber : 'لا يوجد'}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {lastTruck && (
                            <Card title="آخر عربية مسجلة" className="bg-green-50 border-green-200">
                                <div className="space-y-2">
                                    <div className="flex items-center text-green-700">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        <span className="text-sm">تم التسجيل بنجاح</span>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-medium">رقم اللوحة:</span> {lastTruck.plateNumber}</p>
                                        <p><span className="font-medium">المقاول:</span> {lastTruck.contractor}</p>
                                        <p><span className="font-medium">المصنع:</span> {lastTruck.factory}</p>
                                        <p><span className="font-medium">الوقت:</span> {new Date(lastTruck.truck.registeredAt).toLocaleTimeString('ar-EG')}</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card title="ملاحظات مهمة" className="bg-blue-50 border-blue-200">
                            <div className="space-y-2 text-sm text-blue-800">
                                <div className="flex items-start">
                                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <p>تأكد من صحة جميع البيانات قبل التسجيل</p>
                                </div>
                                <div className="flex items-start">
                                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <p>رقم كارتة المصنع يختلف عن رقم كارتة الجهاز</p>
                                </div>
                                <div className="flex items-start">
                                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <p>يمكن تسجيل عربيات لأكثر من مصنع من نفس البوابة</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewTruck; 