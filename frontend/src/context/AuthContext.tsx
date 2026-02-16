import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../api/client';
import type { User } from '../types';

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string, user?: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    isKycVerified: boolean;
    setKycVerified: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isKycVerified, setIsKycVerified] = useState(() => localStorage.getItem('kyc_verified') === 'true');

    const setKycVerified = (v: boolean) => {
        setIsKycVerified(v);
        localStorage.setItem('kyc_verified', v.toString());
    };

    useEffect(() => {
        // If token exists, we could validate it or fetch user profile
        // For now we just set isAuthenticated state
        if (token) {
            localStorage.setItem('token', token);
            // Fetch me
            api.get('/me').then(res => {
                setUser(res.data); // data:{id, role, name} from backend
            }).catch(() => {
                // Token invalid
                logout();
            }).finally(() => setIsLoading(false));
        } else {
            localStorage.removeItem('token');
            setIsLoading(false);
        }
    }, [token]);

    const login = (newToken: string, newUser?: User) => {
        setToken(newToken);
        if (newUser) setUser(newUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('kyc_verified');
        setIsKycVerified(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, isLoading, isKycVerified, setKycVerified }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
