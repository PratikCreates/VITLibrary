import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../client';
import type { Wallet, Transaction, PaymentSource } from '../../types';

export const useGetWallet = () => {
    return useQuery<Wallet>({
        queryKey: ['wallet'],
        queryFn: async () => {
            const { data } = await api.get<Wallet>('/wallet');
            return data;
        },
    });
};

export const useAddFunds = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (amount: number) => {
            return await api.post('/wallet/add', { amount }); // Using alias '/add'
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
    });
};

export const useAddSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (source: { type: string, provider: string, identifier: string }) => {
            return await api.post('/wallet/source', source);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
    });
};

// Also adding /api/wallet/upi alias usage if needed, but generic source is preferred
export const useAddUPI = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (upi: string) => {
            return await api.post('/wallet/upi', { upi });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        }
    });
};
