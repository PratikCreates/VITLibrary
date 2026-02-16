import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, User, FileText, Upload, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useGetWallet } from '../api/hooks/useWalletHooks';
import { toast } from '../components/ui/Toaster';
import clsx from 'clsx';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: wallet, isLoading: walletLoading } = useGetWallet();

    const { isKycVerified } = useAuth();

    const quickActions = [
        {
            title: "Wallet",
            icon: Wallet,
            action: () => navigate('/wallet'),
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Profile",
            icon: User,
            action: () => navigate('/profile'),
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: isKycVerified ? "KYC Verified" : "Verify KYC",
            icon: isKycVerified ? ShieldCheck : ShieldAlert,
            action: () => navigate(isKycVerified ? '/profile' : '/kyc'),
            color: isKycVerified ? "text-green-500" : "text-yellow-500",
            bg: isKycVerified ? "bg-green-500/10" : "bg-yellow-500/10"
        },
        {
            title: "My Bookings",
            icon: FileText,
            action: () => {
                if (!isKycVerified) {
                    toast('KYC Verification Required', 'error');
                } else {
                    // navigate to bookings in Sprint 2
                }
            },
            description: !isKycVerified ? "Verify to unlock" : "Coming Soon",
            color: "text-primary",
            bg: "bg-primary/10"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="glass-panel p-8 rounded-2xl">
                <h1 className="text-3xl font-bold tracking-tight text-gradient">Hello, {user?.name}</h1>
                <p className="text-muted-foreground mt-2">Welcome to your library dashboard.</p>

                {wallet && (
                    <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                        <p className="text-sm font-medium text-primary uppercase tracking-wider">Current Balance</p>
                        <p className="text-4xl font-extrabold text-foreground mt-1">₹{wallet.balance.toFixed(2)}</p>
                    </div>
                )}
                {walletLoading && (
                    <div className="mt-6 h-20 w-48 animate-pulse bg-muted rounded-xl"></div>
                )}
            </div>

            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={action.action}
                        className="glass-card p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-3 group"
                    >
                        <div className={`p-3 rounded-full ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                            <action.icon size={24} />
                        </div>
                        <h3 className="font-medium text-foreground">{action.title}</h3>
                        {action.description && <p className="text-xs text-muted-foreground">{action.description}</p>}
                    </button>
                ))}
            </div>
        </div>
    );
}
