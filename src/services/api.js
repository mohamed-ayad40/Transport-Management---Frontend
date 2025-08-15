import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL
    // || 'http://localhost:5000/api';

// إنشاء instance للـ axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// إضافة interceptor لإضافة التوكن
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// إضافة interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API functions
export const authAPI = {
    login: (credentials) => api.post('auth/login', credentials),
    getMe: () => api.get('/auth/me'),
};

export const trucksAPI = {
    // register: (data) => api.post('/trucks/register', data),
    registerNewTruck: (data) => api.post('/trucks/register-new-truck', data),
    getAll: (params) => api.get('/trucks', { params }),
    getMyTrucks: (params) => api.get('/trucks/my-trucks', { params }),
    update: (id, data) => api.put(`/trucks/${id}`, data),
    getMyStats: () => api.get('/trucks/my-stats'),
};

export const contractorsAPI = {
    getAll: () => api.get('/contractors'),
    create: (data) => api.post('/contractors', data),
    update: (id, data) => api.put(`/contractors/${id}`, data),
    delete: (id) => api.delete(`/contractors/${id}`),
    getStats: (id) => api.get(`/contractors/${id}/stats`),
};

export const factoriesAPI = {
    getAll: () => api.get('/factories'),
    create: (data) => api.post('/factories', data),
    update: (id, data) => api.put(`/factories/${id}`, data),
    delete: (id) => api.delete(`/factories/${id}`),
    getStats: (id) => api.get(`/factories/${id}/stats`),
};

export const gatesAPI = {
    getAll: () => api.get('/gates'),
    create: (data) => api.post('/gates', data),
    update: (id, data) => api.put(`/gates/${id}`, data),
    delete: (id) => api.delete(`/gates/${id}`),
};


export const usersAPI = {
    getAll: () => api.get('/users'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    updatePassword: (id, data) => api.put(`/users/${id}/password`, data),
    delete: (id) => api.delete(`/users/${id}`),
    getStats: (id) => api.get(`/users/${id}/stats`),
};

export const statsAPI = {
    getDashboard: (params) => api.get('/stats/dashboard', { params }),
    getContractorStats: (id, params) => api.get(`/stats/contractor/${id}`, { params }),
    getFactoryStats: (id, params) => api.get(`/stats/factory/${id}`, { params }),
    getGateStats: (gateId, params) => api.get(`/stats/gate/${gateId}`, { params }),
};

export default api; 