import axios from 'axios';
import { refreshReq } from './authentication';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Axios instance với interceptor
 * - Tự động thêm Authorization header
 * - Nếu 401 → refresh token + retry
 */
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor: Thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Xử lý 401 + refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    isRefreshing = false;
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('⏰ Token expired, refreshing...');
                const res = await refreshReq();

                if (res.ok) {
                    const newToken = res.data.accessToken;
                    sessionStorage.setItem('accessToken', newToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    
                    console.log('✅ Token refreshed, retrying request...');
                    return axiosInstance(originalRequest);
                } else {
                    // Refresh fail → logout
                    processQueue(error, null);
                    sessionStorage.clear();
                    window.location.href = '/login';
                }
            } catch (refreshError) {
                console.error('❌ Refresh failed:', refreshError);
                processQueue(refreshError, null);
                sessionStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
