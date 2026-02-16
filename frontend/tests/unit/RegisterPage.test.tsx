import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegisterPage from '../../src/pages/Auth/RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../../src/components/ui/Toaster';

// Mock API Hooks
const mockRegisterStudent = vi.fn();
const mockRegisterEmployee = vi.fn();

vi.mock('../../src/api/hooks/useAuthHooks', () => ({
    useRegisterStudent: () => ({
        mutate: (data: any, options: any) => {
            mockRegisterStudent(data);
            options.onSuccess();
        },
    }),
    useRegisterEmployee: () => ({
        mutate: (data: any, options: any) => {
            mockRegisterEmployee(data);
            options.onSuccess();
        },
    }),
}));

const queryClient = new QueryClient();

describe('RegisterPage', () => {
    it('renders student registration form by default', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <RegisterPage />
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
        expect(screen.getByText(/Join the library as a student/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Register Number/i)).toBeInTheDocument();
    });

    it('switches to employee registration form', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <RegisterPage />
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByText('Employee'));
        expect(screen.getByText(/Join the library as a employee/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Employee Code/i)).toBeInTheDocument();
    });

    it('validates student registration', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <RegisterPage />
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        );

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Student' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@vitstudent.ac.in' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

        // Select DoB from dropdowns
        fireEvent.change(screen.getByRole('combobox', { name: /Day/i || "" }), { target: { value: '01' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Month/i || "" }), { target: { value: '01' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Year/i || "" }), { target: { value: '2001' } });

        fireEvent.change(screen.getByLabelText(/Register Number/i), { target: { value: '22BCE1234' } });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(mockRegisterStudent).toHaveBeenCalledWith(expect.objectContaining({
                dob: '2001-01-01'
            }));
        });
    });
});
