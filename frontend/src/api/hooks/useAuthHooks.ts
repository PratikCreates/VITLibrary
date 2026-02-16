import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../client';
import type { AuthResponse, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await api.post<AuthResponse>('/auth/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            login(data.token);
            navigate('/dashboard');
        }
    });
};

export const useAdminLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await api.post<AuthResponse>('/auth/admin/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            login(data.token);
            navigate('/admin/dashboard');
        }
    });
};

export const useRegisterStudent = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data: any) => {
            return await api.post('/auth/register/student', data);
        },
        onSuccess: () => {
            navigate('/login');
        }
    });
};

export const useRegisterEmployee = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data: any) => {
            return await api.post('/auth/register/employee', data);
        },
        onSuccess: () => {
            navigate('/login');
        }
    });
};
