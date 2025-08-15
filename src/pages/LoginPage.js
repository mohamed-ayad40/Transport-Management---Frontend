import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Truck, Shield, User } from 'lucide-react';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { login, error, clearError } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            clearError();
            await login(data);
            toast.success('تم تسجيل الدخول بنجاح');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'خطأ في تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary-600 p-3 rounded-full">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        نظام إدارة عربيات البنجر
                    </h1>
                    <p className="text-gray-600">
                        سجل دخولك للوصول إلى لوحة التحكم
                    </p>
                </div>

                {/* Login Form */}
                <Card className="mb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="البريد الإلكتروني"
                            type="email"
                            placeholder="أدخل بريدك الإلكتروني"
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'البريد الإلكتروني مطلوب',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'البريد الإلكتروني غير صحيح',
                                },
                            })}
                        />

                        <Input
                            label="كلمة المرور"
                            type="password"
                            placeholder="أدخل كلمة المرور"
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'كلمة المرور مطلوبة',
                                minLength: {
                                    value: 6,
                                    message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                                },
                            })}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading}
                            disabled={loading}
                        >
                            تسجيل الدخول
                        </Button>
                    </form>
                </Card>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Shield className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-sm text-gray-900">العسكري</h3>
                        <p className="text-xs text-gray-600">تسجيل العربيات ومتابعة الإحصائيات</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <User className="w-6 h-6 text-success-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-sm text-gray-900">الأدمن</h3>
                        <p className="text-xs text-gray-600">إدارة النظام والمراجعة</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Truck className="w-6 h-6 text-warning-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-sm text-gray-900">موظف البوابة</h3>
                        <p className="text-xs text-gray-600">تسجيل سريع بدون دخول</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        نظام إدارة عربيات تحميل البنجر - الإصدار 1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 