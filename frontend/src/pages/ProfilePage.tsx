import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/Toaster';
import { useProfile, useUpdateProfile } from '../api/hooks/useProfileHooks';
import { User, Mail, MapPin, Calendar, CheckCircle, AlertCircle, Camera, Tag, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = [
    "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Biography",
    "History", "Technology", "Science", "Business", "Self-Help",
    "Art", "Poetry", "Philosophy", "Psychology", "Mystery"
];

export default function ProfilePage() {
    const { user, isKycVerified, setKycVerified } = useAuth();
    const { data: profile, isLoading, error } = useProfile();
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const [isKycPending, setIsKycPending] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm({
        mode: "onChange"
    });

    const selectedPreferences = watch("preferences") || [];

    const onSubmit = (data: any) => {
        const dob = `${data.dob_year}-${data.dob_month}-${data.dob_day}`;
        const submissionData = { ...data, dob };
        delete submissionData.dob_day;
        delete submissionData.dob_month;
        delete submissionData.dob_year;

        updateProfile(submissionData, {
            onSuccess: () => toast('Profile updated successfully!', 'success'),
            onError: () => toast('Update failed', 'error')
        });
    };

    if (isLoading) return <div className="text-center p-8 text-muted-foreground animate-pulse">Loading profile...</div>;

    // Use fetched profile or fallback to auth user data partially
    const initialData = profile || { name: user?.name, email: 'loading...', dob: '', address: '' };

    const handleKyc = () => {
        navigate('/kyc');
    };

    const togglePreference = (cat: string) => {
        const current = selectedPreferences as string[];
        if (current.includes(cat)) {
            setValue("preferences", current.filter(c => c !== cat));
        } else {
            setValue("preferences", [...current, cat]);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">My Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
                </div>
                <div className="flex items-center space-x-2 bg-muted/20 px-4 py-2 rounded-full border border-border">
                    {isKycVerified ? (
                        <>
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-sm font-medium text-green-500">KYC Verified</span>
                        </>
                    ) : (
                        <button
                            onClick={handleKyc}
                            disabled={isKycPending}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            {isKycPending ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <ShieldCheck size={16} className="text-yellow-500" />}
                            <span className="text-sm font-medium">{isKycPending ? 'Verifying...' : 'Complete KYC'}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Card */}
                <div className="lg:col-span-1 glass-card p-6 rounded-2xl h-fit text-center space-y-6">
                    <div className="relative group w-24 h-24 mx-auto cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={24} className="text-white" />
                        </div>
                        <input
                            id="photo-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setFile(e.target.files[0]);
                                    toast('Photo selected (upload mock)', 'success');
                                }
                            }}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{user?.name}</h2>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{user?.role}</span>
                    </div>
                    <div className="text-left space-y-4 pt-6 border-t border-border">
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <Mail size={16} className="text-primary" />
                            <span className="truncate">{initialData.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <MapPin size={16} className="text-primary" />
                            <span className="truncate">{initialData.address || "No address set"}</span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">Personal Information</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Display Name (Username)</label>
                                <input
                                    defaultValue={initialData.name || user?.name}
                                    {...register("name")}
                                    className="input-field w-full p-2.5 rounded-md bg-background border border-primary text-foreground font-medium"
                                    placeholder="First Last"
                                />
                                <p className="text-[10px] text-muted-foreground">Default: FirstName LastName</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date of Birth</label>
                                <div className="flex gap-2">
                                    <select aria-label="Day" defaultValue={initialData.dob?.split('T')[0]?.split('-')[2]} {...register("dob_day")} className="input-field w-1/4 p-2 rounded-md bg-background border border-border text-sm">
                                        <option value="">Day</option>
                                        {[...Array(31)].map((_, i) => (
                                            <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <select aria-label="Month" defaultValue={initialData.dob?.split('T')[0]?.split('-')[1]} {...register("dob_month")} className="input-field w-1/3 p-2 rounded-md bg-background border border-border text-sm">
                                        <option value="">Month</option>
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                                            <option key={m} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                                        ))}
                                    </select>
                                    <select aria-label="Year" defaultValue={initialData.dob?.split('T')[0]?.split('-')[0]} {...register("dob_year")} className="input-field flex-1 p-2 rounded-md bg-background border border-border text-sm">
                                        <option value="">Year</option>
                                        {[...Array(100)].map((_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={year} value={year.toString()}>{year}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Address</label>
                                <textarea defaultValue={initialData.address} {...register("address")} rows={3} className="input-field w-full p-2.5 rounded-md bg-background border border-border resize-none" placeholder="Enter your full address" />
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Tag size={16} className="text-primary" />
                                    Book Preferences
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => togglePreference(cat)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                                selectedPreferences.includes(cat)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" {...register("preferences")} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                            <button type="button" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                            <button type="submit" disabled={isPending} className="btn-primary bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
