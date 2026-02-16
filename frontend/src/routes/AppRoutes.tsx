import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';
import WalletPage from '../pages/WalletPage';
import KycPage from '../pages/KycPage';
import Layout from '../components/layout/Layout';

import AdminLoginPage from '../pages/Admin/AdminLoginPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';

const PrivateRoute = ({ children, role }: { children: JSX.Element, role?: "STUDENT" | "EMPLOYEE" | "ADMIN" }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (role && user?.role !== role && user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/admin/dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
                    <Route path="/kyc" element={<PrivateRoute><KycPage /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
