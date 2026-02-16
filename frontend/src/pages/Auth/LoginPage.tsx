import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api/hooks/useAuthHooks";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

export default function LoginPage() {
    const { mutate: login, } = useLogin(); // Use react-query hook
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const cachedLogin = JSON.parse(localStorage.getItem('login_form_cache') || '{}');
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            role: cachedLogin.role || "STUDENT",
            identity: cachedLogin.identity || "",
            password: ""
        }
    });

    const loginData = watch();

    useEffect(() => {
        const { password, ...cacheData } = loginData;
        localStorage.setItem('login_form_cache', JSON.stringify(cacheData));
    }, [loginData]);

    const role = watch("role");

    const onSubmit = (data: any) => {
        login(data, {
            onSuccess: () => {
                localStorage.removeItem('login_form_cache');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter text-gradient">Welcome Back</h2>
                    <p className="text-muted-foreground">Enter your credentials to access your library account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Role</label>
                        <select
                            id="role"
                            {...register("role", { required: true })}
                            className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="EMPLOYEE">Employee</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="identity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email or {role === "STUDENT" ? "Registration Number" : "Employee Code"}
                        </label>
                        <input
                            id="identity"
                            {...register("identity", {
                                required: "Required",
                                validate: (val) => {
                                    const isEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(val);
                                    const isCode = role === "STUDENT" ? /^[0-9]{2}[A-Z]{3}[0-9]{4}$/.test(val) : /^[0-9]{5}$/.test(val);
                                    if (!isEmail && !isCode) {
                                        return role === "STUDENT" ? "Enter valid Email or Reg No" : "Enter valid Email or Code";
                                    }
                                    return true;
                                }
                            })}
                            className={clsx("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.identity && "border-destructive")}
                            placeholder={role === "STUDENT" ? "e.g. 21BCE0001 or name@vitstudent.ac.in" : "e.g. 12345 or name@vit.ac.in"}
                        />
                        {errors.identity && <span className="text-xs text-destructive animate-in slide-in-from-top-1">{(errors.identity as any).message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Min 8 characters" }
                                })}
                                className={clsx("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", errors.password && "border-destructive")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-xs text-destructive animate-in slide-in-from-top-1">{(errors.password as any).message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Sign In
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <button type="button" onClick={() => navigate('/register')} className="text-primary hover:underline font-medium">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
