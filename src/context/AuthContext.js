import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // التحقق من وجود مستخدم مسجل دخول
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await authAPI.getMe();
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // تسجيل الدخول
    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authAPI.login(credentials);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'خطأ في تسجيل الدخول';
            setError(message);
            throw error;
        }
    };

    // تسجيل الخروج
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    // تحديث بيانات المستخدم
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // مسح الخطأ
    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        clearError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isMilitary: user?.role === 'military',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 