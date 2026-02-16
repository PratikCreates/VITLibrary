import { useForm } from 'react-hook-form';
import { useGetWallet, useAddFunds, useAddSource } from '../api/hooks/useWalletHooks';
import { Wallet, CreditCard, Landmark, DollarSign, ShieldAlert, CheckCircle } from 'lucide-react';
import { toast } from '../components/ui/Toaster';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function WalletPage() {
    const { isKycVerified } = useAuth();
    const { data: wallet, isLoading } = useGetWallet();
    const { mutate: addFunds } = useAddFunds();
    const { mutate: addSource } = useAddSource();

    const { register: registerFunds, handleSubmit: handleFunds, formState: { errors: fundsErrors } } = useForm();
    const { register: registerSource, handleSubmit: handleSource, reset: resetSource, watch: watchSource, formState: { errors: sourceErrors } } = useForm();

    const sourceType = watchSource("type", "UPI");

    const onAddFunds = (data: any) => {
        addFunds(parseFloat(data.amount), {
            onSuccess: () => toast('Funds added successfuly!', 'success'),
            onError: () => toast('Failed to add funds', 'error')
        });
    };

    const onAddSource = (data: any) => {
        addSource(data, {
            onSuccess: () => {
                toast('Payment source added!', 'success');
                resetSource();
            },
            onError: () => toast('Failed to add source', 'error')
        });
    };

    if (isLoading) return <div className="text-center p-8 text-muted-foreground animate-pulse">Loading wallet...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-gradient">My Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-48 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Available Balance</p>
                        <h2 className="text-5xl font-extrabold text-foreground mt-2 tracking-tighter">₹{wallet?.balance.toFixed(2)}</h2>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Wallet size={16} />
                        <span>Secure Transaction</span>
                    </div>
                </div>

                {/* Add Funds */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden h-fit">
                    {!isKycVerified && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
                            <ShieldAlert size={40} className="text-destructive" />
                            <h4 className="font-bold text-foreground">Verification Needed</h4>
                            <p className="text-[10px] text-muted-foreground">KYC required to deposit funds.</p>
                        </div>
                    )}
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign size={20} className="text-primary" /> Add Funds</h3>
                    <form onSubmit={handleFunds(onAddFunds)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-bold">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-foreground font-bold font-mono">₹</span>
                                <input
                                    id="amount"
                                    type="number"
                                    step="1"
                                    className="input-field pl-8 w-full p-2.5 rounded-lg bg-background border-2 border-primary text-foreground font-bold text-xl"
                                    placeholder="0"
                                    {...registerFunds("amount", { required: true, min: 1 })}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={!isKycVerified} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-black transition-all shadow-2xl shadow-primary/30 active:scale-[0.95] disabled:opacity-50">
                            Instant Deposit
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Source */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col">
                    {!isKycVerified && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <div className="p-4 bg-destructive/10 rounded-full">
                                <ShieldAlert size={48} className="text-destructive" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-foreground">KYC Verification Required</h4>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto">
                                    To maintain a secure library environment, identity verification is required before adding funds.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/profile')}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-all"
                            >
                                Complete KYC Now
                            </button>
                        </div>
                    )}
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <CreditCard size={20} className="text-primary" /> Add Payment Source
                    </h3>
                    <form onSubmit={handleSource(onAddSource)} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'UPI', label: 'UPI', icon: DollarSign },
                                    { id: 'CARD', label: 'Card', icon: CreditCard },
                                    { id: 'BANK', label: 'Bank', icon: Landmark }
                                ].map((t) => (
                                    <label
                                        key={t.id}
                                        className={clsx(
                                            "flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary/50",
                                            sourceType === t.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-muted bg-background"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            value={t.id}
                                            {...registerSource("type", { required: true })}
                                            className="hidden"
                                        />
                                        <t.icon size={20} className={sourceType === t.id ? "text-primary" : "text-muted-foreground"} />
                                        <span className={clsx("text-xs font-bold mt-2", sourceType === t.id ? "text-primary" : "text-muted-foreground")}>{t.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="provider" className="text-sm font-bold">Provider</label>
                                <input
                                    id="provider"
                                    {...registerSource("provider", { required: "Provider required" })}
                                    className="input-field w-full p-2.5 rounded-lg bg-background border-2 border-primary placeholder:text-muted-foreground font-medium"
                                    placeholder={sourceType === "UPI" ? "e.g. GPay" : "e.g. HDFC"}
                                />
                                {sourceErrors.provider && <span className="text-[10px] text-destructive font-bold">{(sourceErrors.provider as any).message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="identifier" className="text-sm font-bold">
                                    {sourceType === "UPI" ? "UPI ID" : sourceType === "CARD" ? "Card Number" : "Account Number"}
                                </label>
                                <input
                                    id="identifier"
                                    {...registerSource("identifier", {
                                        required: "Required",
                                        pattern: {
                                            value: sourceType === "CARD" ? /^\d{4} \d{4} \d{4} \d{4}$/ : sourceType === "UPI" ? /^[\w.-]+@[\w.-]+$/ : /^\d{9,18}$/,
                                            message: "Invalid format"
                                        }
                                    })}
                                    className={clsx("input-field w-full p-2.5 rounded-lg bg-background border-2 font-medium", sourceErrors.identifier ? "border-destructive text-destructive" : "border-primary text-foreground")}
                                    placeholder={sourceType === "CARD" ? "1234 5678 1234 5678" : sourceType === "UPI" ? "user@upi" : "Account Number"}
                                />
                                {sourceErrors.identifier && <span className="text-[10px] text-destructive font-bold">{(sourceErrors.identifier as any).message}</span>}
                            </div>
                        </div>

                        <button type="submit" disabled={!isKycVerified} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-black/90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                            <CheckCircle size={18} />
                            Verify & Save Payment Method
                        </button>
                    </form>
                </div>

                {/* Saved Sources */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Landmark size={20} className="text-accent" /> Saved Sources</h3>
                    {wallet?.paymentSources.length === 0 ? (
                        <p className="text-muted-foreground text-sm italic py-8 text-center">No payment sources saved yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {wallet?.paymentSources.map(source => (
                                <li key={source.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-background/80 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            {source.type === 'UPI' ? <DollarSign size={16} /> : <CreditCard size={16} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{source.provider}</p>
                                            <p className="text-xs text-muted-foreground">{source.identifier}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{source.type}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Transactions History */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {wallet?.transactions.length === 0 ? (
                    <p className="text-muted-foreground text-sm italic py-8 text-center">No transactions yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 rounded-tl-lg">Date</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3 rounded-tr-lg text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallet?.transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">{tx.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.transaction_type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {tx.transaction_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono">
                                            {tx.transaction_type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
