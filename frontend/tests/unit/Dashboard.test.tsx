import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../../src/pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../src/context/AuthContext';

// Mock useAuth
vi.mock('../../src/context/AuthContext', async () => {
    const actual = await vi.importActual('../../src/context/AuthContext') as any;
    return {
        ...actual,
        useAuth: () => ({
            user: { name: 'Test User', role: 'STUDENT' },
            isAuthenticated: true,
            isLoading: false,
        }),
    };
});

// Mock useGetWallet
vi.mock('../../src/api/hooks/useWalletHooks', () => ({
    useGetWallet: () => ({
        data: { balance: 1234.56 },
        isLoading: false,
    }),
}));

const queryClient = new QueryClient();

describe('Dashboard', () => {
    it('renders welcome message and balance', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Dashboard />
                </BrowserRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Hello, Test User/i)).toBeInTheDocument();
        expect(screen.getByText(/₹1234.56/i)).toBeInTheDocument();
        expect(screen.getByText(/KYC Upload/i)).toBeInTheDocument();
    });
});
