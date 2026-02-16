import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WalletPage from '../../src/pages/WalletPage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../../src/components/ui/Toaster';

// Mock API Hooks
const mockAddFunds = vi.fn();
const mockAddSource = vi.fn();

vi.mock('../../src/api/hooks/useWalletHooks', () => ({
    useGetWallet: () => ({
        data: {
            balance: 500.00,
            paymentSources: [
                { id: '1', type: 'UPI', provider: 'GPay', identifier: 'test@okaxis' }
            ],
            transactions: [
                { id: 't1', created_at: '2023-01-01', description: 'Test Credit', transaction_type: 'CREDIT', amount: 100 }
            ]
        },
        isLoading: false,
    }),
    useAddFunds: () => ({
        mutate: mockAddFunds,
    }),
    useAddSource: () => ({
        mutate: mockAddSource,
    }),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('WalletPage', () => {
    it('renders wallet balance and transaction history', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <WalletPage />
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText(/₹500.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Test Credit/i)).toBeInTheDocument();
        expect(screen.getByText(/GPay/i)).toBeInTheDocument();
    });

    it('allows adding funds', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <WalletPage />
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        );

        const amountInput = screen.getByLabelText(/Amount \(₹\)/i);
        fireEvent.change(amountInput, { target: { value: '100' } });

        const addButton = screen.getByRole('button', { name: /Add to Wallet/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockAddFunds).toHaveBeenCalledWith(100, expect.any(Object));
        });
    });
});
