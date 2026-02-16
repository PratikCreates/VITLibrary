import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401s if needed (e.g. redirect to login)
api.interceptors.response.use(
    response => response,
    error => {
        // Optional: clear token on 401
        if (error.response && error.response.status === 401) {
            // console.warn("Unauthorized, token might be invalid");
        }
        return Promise.reject(error);
    }
);

export default api;
