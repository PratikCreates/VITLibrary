import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../../src/pages/Auth/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../src/context/AuthContext';

// Mock API Call
vi.mock('../../src/api/hooks/useAuthHooks', () => ({
    useLogin: () => ({
        mutate: vi.fn(),
    }),
}));

const queryClient = new QueryClient();

describe('LoginPage', () => {
    it('renders login form correctly', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <BrowserRouter>
                        <LoginPage />
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/21BCE/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });
});
