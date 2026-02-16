import { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, User, Wallet, FileText, LogOut, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from '../ThemeToggle';

const Layout = () => {
    const { logout, user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm glass-panel">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold text-xl">V</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">VIT Library {isAdmin && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">ADMIN</span>}</h1>
                    </div>

                    <nav className="flex items-center space-x-6">
                        {!isAdmin ? (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => clsx("flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}>
                                    <Home className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </NavLink>
                                <NavLink to="/wallet" className={({ isActive }) => clsx("flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}>
                                    <Wallet className="w-4 h-4" />
                                    <span>Wallet</span>
                                </NavLink>
                            </>
                        ) : (
                            <NavLink to="/admin/dashboard" className={({ isActive }) => clsx("flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Management</span>
                            </NavLink>
                        )}
                        <NavLink to="/profile" className={({ isActive }) => clsx("flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}>
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </NavLink>

                        <div className="h-4 w-px bg-border mx-2" />

                        <ThemeToggle />

                        <button onClick={logout} className="flex items-center space-x-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
