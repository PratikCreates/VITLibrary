import { useNavigate } from "react-router-dom";
import { useAdminLogin } from "../../api/hooks/useAuthHooks";
import { useForm } from "react-hook-form";
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "../../components/ui/Toaster";
import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle";

export default function AdminLoginPage() {
    const { mutate: login, isPending } = useAdminLogin();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange"
    });

    const onSubmit = (data: any) => {
        login(data, {
            onError: (err: any) => {
                toast(err.response?.data?.error || "Login failed", "error");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="glass-card w-full max-w-lg p-8 rounded-2xl shadow-2xl space-y-8 border border-primary/20 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 rotate-3 shadow-2xl">
                        <ShieldCheck size={36} />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Secure Console</h2>
                    <p className="text-muted-foreground font-medium">ADMINISTRATIVE ACCESS REQUIRED</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                            Credential Identifier
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, message: "Invalid email" }
                            })}
                            className="flex h-12 w-full rounded-xl border-2 border-muted bg-background px-4 py-2 text-sm focus:border-primary outline-none transition-all font-bold"
                            placeholder="admin@vit.ac.in"
                        />
                        {errors.email && <span className="text-[10px] font-bold text-destructive uppercase tracking-wide">{(errors.email as any).message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                            Security Key
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password required",
                                    minLength: { value: 6, message: "6+ chars" }
                                })}
                                className="flex h-12 w-full rounded-xl border-2 border-muted bg-background px-4 py-2 pr-12 text-sm focus:border-primary outline-none transition-all font-bold"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-[10px] font-bold text-destructive uppercase tracking-wide">{(errors.password as any).message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full inline-flex items-center justify-center rounded-xl text-sm font-black bg-primary text-primary-foreground hover:bg-black h-14 px-4 py-2 transition-all disabled:opacity-50 shadow-2xl shadow-primary/20 uppercase tracking-widest mt-4 active:scale-[0.98]"
                    >
                        {isPending ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Authorize Entry"}
                    </button>

                    <div className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-8 border-t border-border opacity-30">
                        System Version 2.0.4 // VIT.LIB.SECURE
                    </div>
                </form>
            </div>
        </div>
    );
}
