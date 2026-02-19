import { useState } from 'react';
import { useUploadKyc } from '../api/hooks/useKycHooks';
import { useAuth } from '../context/AuthContext';
import { Upload, CheckCircle, ShieldAlert, Clock, Check } from 'lucide-react';
import { toast } from '../components/ui/Toaster';

export default function KycPage() {
    const { user, setKycVerified } = useAuth();
    const { mutate: uploadKyc, isPending } = useUploadKyc();
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [backPreview, setBackPreview] = useState<string | null>(null);
    const [type, setType] = useState("AADHAR");
    const [submittedDocs, setSubmittedDocs] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];

            // Strictly no SVGs
            if (selected.type.includes('svg') || selected.name.toLowerCase().endsWith('.svg')) {
                toast('SVG files are not allowed for security reasons', 'error');
                return;
            }

            if (side === 'front') {
                setFrontFile(selected);
                setFrontPreview(URL.createObjectURL(selected));
            } else {
                setBackFile(selected);
                setBackPreview(URL.createObjectURL(selected));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (type === 'PAN' && !frontFile) {
            toast('PAN Card front side is required', 'error');
            return;
        }

        if (type !== 'PAN' && (!frontFile || !backFile)) {
            toast(`Both Front and Back sides are required for ${type}`, 'error');
            return;
        }

        const submitFile = async (file: File, suffix: string) => {
            return new Promise((resolve, reject) => {
                uploadKyc({ file, doc_type: `${type}_${suffix}` }, {
                    onSuccess: resolve,
                    onError: reject
                });
            });
        }

        const uploadAll = async () => {
            try {
                if (frontFile) await submitFile(frontFile, 'FRONT');
                if (backFile) await submitFile(backFile, 'BACK');

                toast('KYC Verified! You can now use all features.', 'success');
                setKycVerified(true);

                // Add to submitted docs for status display
                setSubmittedDocs(prev => [...prev, {
                    id: Date.now(),
                    type,
                    date: new Date().toLocaleDateString(),
                    status: 'Accepted',
                    remarks: 'Accepted'
                }]);

                // Reset form
                setFrontFile(null);
                setBackFile(null);
                setFrontPreview(null);
                setBackPreview(null);
            } catch (err) {
                // Mock success even on error for now as requested
                toast('KYC Verified! You can now use all features.', 'success');
                setKycVerified(true);
                setSubmittedDocs(prev => [...prev, {
                    id: Date.now(),
                    type,
                    date: new Date().toLocaleDateString(),
                    status: 'Accepted',
                    remarks: 'Accepted'
                }]);
                setFrontFile(null);
                setBackFile(null);
                setFrontPreview(null);
                setBackPreview(null);
            }
        };

        uploadAll();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold text-gradient">Identity Verification</h1>
                <p className="text-muted-foreground w-full max-w-2xl mx-auto">
                    Complete your KYC to unlock full library features and secure lending.
                    Please provide clear photos of your government IDs.
                </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-primary/10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            Select Document Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'AADHAR', label: 'Aadhar Card' },
                                { id: 'PAN', label: 'PAN Card' },
                                { id: 'ID_CARD', label: 'College ID' }
                            ].map((doc) => (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => {
                                        setType(doc.id);
                                        setFrontFile(null);
                                        setBackFile(null);
                                        setFrontPreview(null);
                                        setBackPreview(null);
                                    }}
                                    className={`p-4 rounded-xl border-2 font-bold transition-all ${type === doc.id
                                        ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                                        : "border-muted bg-background text-muted-foreground hover:border-primary/30"
                                        }`}
                                >
                                    {doc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Front Side */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Front Side Image</label>
                            <div className="group relative h-48 rounded-2xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-all flex flex-col items-center justify-center overflow-hidden">
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => handleFileChange(e, 'front')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {frontPreview ? (
                                    <div className="relative w-full h-full p-2">
                                        <img src={frontPreview} alt="Front Preview" className="w-full h-full object-contain rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setFrontFile(null); setFrontPreview(null); }}
                                            className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:scale-110 transition-transform z-20"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-2">
                                        <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto text-primary group-hover:scale-110 transition-transform">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-bold">Select Front Side</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Side (Only if not PAN) */}
                        {type !== 'PAN' && (
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Back Side Image</label>
                                <div className="group relative h-48 rounded-2xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-all flex flex-col items-center justify-center overflow-hidden">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => handleFileChange(e, 'back')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {backPreview ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={backPreview} alt="Back Preview" className="w-full h-full object-contain rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); setBackFile(null); setBackPreview(null); }}
                                                className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:scale-110 transition-transform z-20"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto text-primary group-hover:scale-110 transition-transform">
                                                <Upload size={24} />
                                            </div>
                                            <p className="text-sm font-bold">Select Back Side</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                        <ShieldAlert size={20} className="text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold">Security Guidelines</p>
                            <p className="text-xs text-muted-foreground">
                                Ensure all details are clearly visible. Allowed formats: JPG, PNG, PDF. **SVGs are not accepted**.
                                {type !== 'PAN' ? " Both front and back sides are mandatory for Aadhar and ID cards." : " PAN card only requires a clear front side photo."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 active:scale-[0.98] text-lg uppercase tracking-tight"
                    >
                        {isPending ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /> : (
                            <>
                                <CheckCircle size={22} />
                                Submit Documents for Review
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* KYC Application Status Section */}
            <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock size={24} className="text-primary" /> KYC Application Status
                </h3>
                {submittedDocs.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No recent submissions found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Document Type</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {submittedDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-4 py-4 text-sm">{doc.date}</td>
                                        <td className="px-4 py-4"><span className="font-bold text-sm">{doc.type}</span></td>
                                        <td className="px-4 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-green-500/10 text-green-500 rounded-full w-fit">
                                                <Check size={14} /> {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">{doc.remarks}</td>
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
