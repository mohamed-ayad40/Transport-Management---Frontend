import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CreateNewTruck from './pages/CreateNewTruck';
import AdminDashboard from './pages/AdminDashboard';
import MilitaryDashboard from './pages/MilitaryDashboard';
import UserManagementPage from './pages/UserManagementPage';
import ContractorManagementPage from './pages/ContractorManagementPage';
import FactoryManagementPage from './pages/FactoryManagementPage';
import TruckManagementPage from './pages/TruckManagementPage';
import StatisticsPage from './pages/StatisticsPage';
import './index.css';
import GatesManagement from './pages/GatesManagement';

// إنشاء QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// مكون للحماية من الوصول غير المصرح
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

// مكون التطبيق الرئيسي
const AppContent = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {/* الصفحة الرئيسية */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* صفحة تسجيل الدخول */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />

                {/* صفحة موظف البوابة (بدون تسجيل دخول) */}
                <Route path="/new-truck" element={<CreateNewTruck />} />

                {/* صفحات محمية */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'military']}>
                            {user?.role === 'admin' ? <AdminDashboard /> : <MilitaryDashboard />}
                        </ProtectedRoute>
                    }
                />

                {/* Admin Management Pages */}
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <UserManagementPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/contractors"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ContractorManagementPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/factories"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <FactoryManagementPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/gates"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <GatesManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/trucks"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <TruckManagementPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/statistics"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <StatisticsPage />
                        </ProtectedRoute>
                    }
                />

                {/* صفحة غير مصرح */}
                <Route
                    path="/unauthorized"
                    element={
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-danger-600 mb-4">
                                    غير مصرح
                                </h1>
                                <p className="text-gray-600">
                                    ليس لديك صلاحية للوصول لهذه الصفحة
                                </p>
                            </div>
                        </div>
                    }
                />

                {/* صفحة 404 */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    404 - الصفحة غير موجودة
                                </h1>
                                <p className="text-gray-600">
                                    الصفحة التي تبحث عنها غير موجودة
                                </p>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
};

// المكون الرئيسي
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppContent />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App; 