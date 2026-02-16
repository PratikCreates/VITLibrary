import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Plus, Edit2, Trash2, BookOpen, Layers, Users, TrendingUp,
    History, CreditCard, ShieldCheck, Check, X, Search
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { toast } from '../../components/ui/Toaster';
import clsx from 'clsx';

type TabType = 'inventory' | 'users' | 'activities' | 'kyc';

export default function AdminDashboard() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>('inventory');
    const [isAdding, setIsAdding] = useState(false);
    const [editingBook, setEditingBook] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Queries
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => (await api.get('/admin/stats')).data
    });

    const { data: books, isLoading: booksLoading } = useQuery({
        queryKey: ['admin-books'],
        queryFn: async () => (await api.get('/books')).data
    });

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => (await api.get('/admin/users')).data,
        enabled: activeTab === 'users'
    });

    const { data: activities, isLoading: activitiesLoading } = useQuery({
        queryKey: ['admin-activities'],
        queryFn: async () => (await api.get('/admin/bookings')).data,
        enabled: activeTab === 'activities'
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: (newBook: any) => api.post('/books', newBook),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-books'] });
            toast("Book added successfully", "success");
            setIsAdding(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (updatedBook: any) => api.put(`/books/${updatedBook.id}`, updatedBook),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-books'] });
            toast("Book updated successfully", "success");
            setEditingBook(null);
        }
    });

    const kycMutation = useMutation({
        mutationFn: ({ userId, status }: { userId: string, status: string }) =>
            api.post('/admin/kyc/verify', { userId, status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast("KYC status updated", "success");
        }
    });

    const statCards = [
        { label: "Total Books", value: stats?.totalBooks || 0, icon: BookOpen, color: "text-blue-500" },
        { label: "Active Bookings", value: stats?.activeBookings || 0, icon: Layers, color: "text-green-500" },
        { label: "Total Members", value: stats?.libraryMembers || 0, icon: Users, color: "text-orange-500" },
        { label: "Late Rate", value: "8%", icon: TrendingUp, color: "text-indigo-500" },
    ];

    if (booksLoading) return <div className="p-8 text-center animate-pulse">Initializing Management Console...</div>;

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gradient">Admin Command Center</h1>
                    <p className="text-muted-foreground mt-1">Full control over inventory, users, and financial state.</p>
                </div>
                {activeTab === 'inventory' && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="btn-primary bg-primary text-primary-foreground flex items-center gap-2 px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-primary/20"
                    >
                        <Plus size={20} /> Add New Title
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl border border-primary/5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-xl bg-background border border-border ${stat.color} shadow-inner`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-muted/30 rounded-2xl w-fit border border-border">
                {(['inventory', 'users', 'activities', 'kyc'] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize",
                            activeTab === tab
                                ? "bg-white text-primary shadow-lg scale-[1.05] z-10"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search Bar for Users/Activities */}
            {(activeTab === 'users' || activeTab === 'activities') && (
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    />
                </div>
            )}

            {/* Dynamic Content Area */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-primary/5 shadow-2xl bg-white/50 backdrop-blur-md">

                {activeTab === 'inventory' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase font-black text-muted-foreground tracking-widest border-b border-border bg-muted/10">
                                <tr>
                                    <th className="px-8 py-5">Volume Details</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Availability Status</th>
                                    <th className="px-8 py-5 text-right">Managemnt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {books?.map((book: any) => (
                                    <tr key={book.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{book.title}</div>
                                            <div className="text-sm text-muted-foreground font-medium">{book.author}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">{book.genre}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-bold">{book.available_copies} / {book.total_copies}</div>
                                                <div className="flex-1 max-w-[100px] h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={clsx(
                                                            "h-full transition-all duration-500",
                                                            (book.available_copies / book.total_copies) < 0.2 ? "bg-destructive shadow-[0_0_8px_#ef4444]" : "bg-primary"
                                                        )}
                                                        style={{ width: `${(book.available_copies / book.total_copies) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2">
                                            <button onClick={() => setEditingBook(book)} className="p-2.5 rounded-lg text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"><Edit2 size={16} /></button>
                                            <button className="p-2.5 rounded-lg text-muted-foreground hover:bg-destructive hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase font-black text-muted-foreground tracking-widest border-b border-border bg-muted/10">
                                <tr>
                                    <th className="px-8 py-5">User Details</th>
                                    <th className="px-8 py-5">ID / Code</th>
                                    <th className="px-8 py-5">Wallet Balance</th>
                                    <th className="px-8 py-5 text-right">KYC Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users?.filter((u: any) => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((u: any) => (
                                    <tr key={u.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-bold">{u.name}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-xs font-black px-2 py-1 bg-muted rounded w-fit">{u.idNumber}</div>
                                            <div className="text-[10px] font-bold mt-1 uppercase text-primary/60">{u.role}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={clsx("font-black text-lg", u.balance < 0 ? "text-destructive" : "text-green-600")}>
                                                ₹{u.balance.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {u.verificationStatus === 'VERIFIED' ? (
                                                <span className="text-green-500 font-bold flex items-center justify-end gap-1"><Check size={16} /> Verified</span>
                                            ) : (
                                                <button
                                                    onClick={() => kycMutation.mutate({ userId: u.id, status: 'VERIFIED' })}
                                                    className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-lg hover:bg-primary hover:text-white transition-all"
                                                >
                                                    Approve KYC
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'activities' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase font-black text-muted-foreground tracking-widest border-b border-border bg-muted/10">
                                <tr>
                                    <th className="px-8 py-5">Book Volume</th>
                                    <th className="px-8 py-5">Lender Name</th>
                                    <th className="px-8 py-5">Borrow Date</th>
                                    <th className="px-8 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {activities?.filter((a: any) =>
                                    a.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    a.account.name.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((act: any) => (
                                    <tr key={act.id} className="hover:bg-primary/5 transition-colors text-sm">
                                        <td className="px-8 py-5 font-bold">{act.book.title}</td>
                                        <td className="px-8 py-5">{act.account.name}</td>
                                        <td className="px-8 py-5">{new Date(act.borrow_date).toLocaleDateString()}</td>
                                        <td className="px-8 py-5">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                act.status === 'ACTIVE' ? "bg-blue-100 text-blue-600" :
                                                    act.status === 'RETURNED' ? "bg-green-100 text-green-600" : "bg-destructive/10 text-destructive"
                                            )}>
                                                {act.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'kyc' && (
                    <div className="p-12 text-center space-y-4">
                        <ShieldCheck size={48} className="mx-auto text-muted-foreground/30" />
                        <div>
                            <h3 className="text-lg font-bold">Document Management Console</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                View and verify submitted identity documents here. Approve or Reject requests for full system access.
                            </p>
                        </div>
                        <button onClick={() => setActiveTab('users')} className="text-primary font-bold hover:underline">Go to Users Tab to Manage Status</button>
                    </div>
                )}

            </div>

            {/* Add/Edit Modal */}
            {(isAdding || editingBook) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-2xl p-8 rounded-3xl shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{editingBook ? "Optimize Volumn" : "Initialize New Entry"}</h3>
                            <button onClick={() => { setIsAdding(false); setEditingBook(null); }} className="p-2 hover:bg-muted rounded-full transition-colors"><X /></button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = Object.fromEntries(formData);
                            const bookData = {
                                ...data,
                                total_copies: parseInt(data.total_copies as string),
                                available_copies: editingBook ? parseInt(data.available_copies as string) : parseInt(data.total_copies as string)
                            };
                            if (editingBook) updateMutation.mutate({ ...bookData, id: editingBook.id });
                            else addMutation.mutate(bookData);
                        }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Volume Title</label>
                                    <input name="title" defaultValue={editingBook?.title} required className="input-field w-full p-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Author</label>
                                    <input name="author" defaultValue={editingBook?.author} required className="input-field w-full p-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Genre / Tag</label>
                                    <input name="genre" defaultValue={editingBook?.genre} required className="input-field w-full p-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-all font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Inventory Count</label>
                                    <input name="total_copies" type="number" defaultValue={editingBook?.total_copies} required className="input-field w-full p-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-all font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Comprehensive Description</label>
                                <textarea name="description" defaultValue={editingBook?.description} rows={4} className="input-field w-full p-4 rounded-xl border-2 border-muted focus:border-primary outline-none transition-all font-medium resize-none" />
                            </div>
                            <div className="flex justify-end gap-4 pt-6 border-t border-border">
                                <button type="button" onClick={() => { setIsAdding(false); setEditingBook(null); }} className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest text-xs">Shutdown</button>
                                <button type="submit" className="btn-primary bg-primary text-primary-foreground px-10 py-3 rounded-xl font-black uppercase tracking-tighter shadow-xl shadow-primary/20 hover:bg-black transition-all">
                                    {editingBook ? "Compile Changes" : "Broadcast Entry"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
