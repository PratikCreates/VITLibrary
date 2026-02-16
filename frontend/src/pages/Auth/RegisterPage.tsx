import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegisterStudent, useRegisterEmployee } from "../../api/hooks/useAuthHooks";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { toast } from "../../components/ui/Toaster";
import { Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

export default function RegisterPage() {
    const [role, setRole] = useState<"STUDENT" | "EMPLOYEE">("STUDENT");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { mutate: registerStudent, isPending: isPendingStudent } = useRegisterStudent();
    const { mutate: registerEmployee, isPending: isPendingEmployee } = useRegisterEmployee();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue, formState: { errors, touchedFields } } = useForm({
        mode: "onChange",
        defaultValues: JSON.parse(localStorage.getItem('register_form_cache') || '{}')
    });

    const formData = watch();

    useEffect(() => {
        const { password, confirmPassword, ...cacheData } = formData;
        localStorage.setItem('register_form_cache', JSON.stringify(cacheData));
    }, [formData]);

    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");

    const getPasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength += 25;
        if (/[A-Z]/.test(pwd)) strength += 25;
        if (/[a-z]/.test(pwd)) strength += 25;
        if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) strength += 25;
        return strength;
    };

    const strength = getPasswordStrength(password);

    const getStrengthColor = (s: number) => {
        if (s <= 25) return "bg-destructive";
        if (s <= 50) return "bg-orange-500";
        if (s <= 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = (s: number) => {
        if (!password) return "";
        if (s <= 25) return "Weak";
        if (s <= 50) return "Fair";
        if (s <= 75) return "Good";
        return "Strong";
    };

    const onSubmit = (data: any) => {
        // Construct DoB string
        const dob = `${data.dob_year}-${data.dob_month}-${data.dob_day}`;
        const submissionData = { ...data, dob };
        delete submissionData.dob_day;
        delete submissionData.dob_month;
        delete submissionData.dob_year;

        // Basic validation
        if (role === 'STUDENT') {
            if (!data.email.endsWith('@vitstudent.ac.in')) {
                toast('Student email must end with @vitstudent.ac.in', 'error');
                return;
            }
            registerStudent(submissionData, {
                onSuccess: () => {
                    localStorage.removeItem('register_form_cache');
                    toast('Registration successful! Please login.', 'success');
                    navigate('/login');
                },
                onError: (err: any) => {
                    toast(err.response?.data?.error || 'Registration failed', 'error');
                }
            });
        } else {
            if (!data.email.endsWith('@vit.ac.in')) {
                toast('Employee email must end with @vit.ac.in', 'error');
                return;
            }
            registerEmployee(submissionData, {
                onSuccess: () => {
                    localStorage.removeItem('register_form_cache');
                    toast('Registration successful! Please login.', 'success');
                    navigate('/login');
                },
                onError: (err: any) => {
                    toast(err.response?.data?.error || 'Registration failed', 'error');
                }
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter text-gradient">Create Account</h2>
                    <p className="text-muted-foreground">Join the library as a {role.toLowerCase()}</p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setRole("STUDENT")}
                        className={clsx("px-4 py-2 rounded-full text-sm font-medium transition-colors", role === "STUDENT" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
                    >
                        Student
                    </button>
                    <button
                        onClick={() => setRole("EMPLOYEE")}
                        className={clsx("px-4 py-2 rounded-full text-sm font-medium transition-colors", role === "EMPLOYEE" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
                    >
                        Employee
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <input id="name" {...register("name", { required: true })} name="name" className="input-field w-full p-2 rounded-md bg-background border border-border" placeholder="John Doe" />
                            {errors.name && <span className="text-xs text-destructive">Required</span>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input id="email" {...register("email", { required: true })} name="email" className="input-field w-full p-2 rounded-md bg-background border border-border" placeholder={role === "STUDENT" ? "john.doe2022@vitstudent.ac.in" : "john.doe@vit.ac.in"} />
                            {errors.email && <span className="text-xs text-destructive">Required</span>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Minimum 8 characters" },
                                        validate: {
                                            uppercase: (v) => /[A-Z]/.test(v) || "Must include uppercase",
                                            lowercase: (v) => /[a-z]/.test(v) || "Must include lowercase",
                                            number: (v) => /[0-9]/.test(v) || "Must include a number",
                                            special: (v) => /[@$!%*?&#^()_-]/.test(v) || "Must include a special character"
                                        }
                                    })}
                                    name="password"
                                    className={clsx("input-field w-full p-2 pr-10 rounded-md bg-background border", errors.password ? "border-destructive" : "border-border")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {password && (
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                                        <span className="text-muted-foreground">Security Strength</span>
                                        <span className={clsx(getStrengthText(strength) === "Strong" ? "text-green-500" : "text-muted-foreground")}>
                                            {getStrengthText(strength)}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={clsx("h-full transition-all duration-500 ease-out", getStrengthColor(strength))}
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                        <div className={clsx("text-[10px] flex items-center gap-1", password.length >= 8 ? "text-green-500" : "text-muted-foreground")}>
                                            <div className={clsx("w-1 h-1 rounded-full", password.length >= 8 ? "bg-green-500" : "bg-muted")} /> 8+ Characters
                                        </div>
                                        <div className={clsx("text-[10px] flex items-center gap-1", /[A-Z]/.test(password) ? "text-green-500" : "text-muted-foreground")}>
                                            <div className={clsx("w-1 h-1 rounded-full", /[A-Z]/.test(password) ? "bg-green-500" : "bg-muted")} /> Uppercase
                                        </div>
                                        <div className={clsx("text-[10px] flex items-center gap-1", /[a-z]/.test(password) ? "text-green-500" : "text-muted-foreground")}>
                                            <div className={clsx("w-1 h-1 rounded-full", /[a-z]/.test(password) ? "bg-green-500" : "bg-muted")} /> Lowercase
                                        </div>
                                        <div className={clsx("text-[10px] flex items-center gap-1", /[0-9]/.test(password) && /[@$!%*?&#^()_-]/.test(password) ? "text-green-500" : "text-muted-foreground")}>
                                            <div className={clsx("w-1 h-1 rounded-full", /[0-9]/.test(password) && /[@$!%*?&#^()_-]/.test(password) ? "bg-green-500" : "bg-muted")} /> Number & Special
                                        </div>
                                    </div>
                                </div>
                            )}
                            {errors.password && <span className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">{(errors.password as any).message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">Retype Password</label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (val: string) => {
                                            if (val && password !== val) {
                                                return "Passwords do not match";
                                            }
                                        },
                                    })}
                                    className={clsx("input-field w-full p-2 pr-10 rounded-md bg-background border", errors.confirmPassword ? "border-destructive" : "border-border")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="text-xs text-destructive animate-in slide-in-from-top-1">{(errors.confirmPassword as any).message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date of Birth</label>
                            <div className="flex gap-2">
                                <select aria-label="Day" {...register("dob_day", { required: true })} className="input-field w-1/4 p-2 rounded-md bg-background border border-border text-sm">
                                    <option value="">Day</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{i + 1}</option>
                                    ))}
                                </select>
                                <select aria-label="Month" {...register("dob_month", { required: true })} className="input-field w-1/3 p-2 rounded-md bg-background border border-border text-sm">
                                    <option value="">Month</option>
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                                        <option key={m} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                                    ))}
                                </select>
                                <select aria-label="Year" {...register("dob_year", { required: "Year is required" })} className="input-field flex-1 p-2 rounded-md bg-background border border-border text-sm">
                                    <option value="">Year</option>
                                    {[...Array(100)].map((_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return <option key={year} value={year}>{year}</option>
                                    })}
                                </select>
                            </div>
                            {(errors.dob_day || errors.dob_month || errors.dob_year) && <span className="text-xs text-destructive">Required</span>}
                        </div>

                        {role === "STUDENT" ? (
                            <div className="space-y-2">
                                <label htmlFor="register_number" className="text-sm font-medium">Register Number</label>
                                <input
                                    id="register_number"
                                    {...register("register_number", {
                                        required: "Register number is required",
                                        pattern: { value: /^[0-9]{2}[A-Z]{3}[0-9]{4}$/, message: "Invalid Format (e.g. 21BCE0001)" }
                                    })}
                                    className={clsx("input-field w-full p-2 rounded-md bg-background border", errors.register_number ? "border-destructive" : "border-border")}
                                    placeholder="21BCE0000"
                                />
                                {errors.register_number && <span className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">{(errors.register_number as any).message}</span>}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label htmlFor="employee_code" className="text-sm font-medium">Employee Code</label>
                                <input
                                    id="employee_code"
                                    {...register("employee_code", {
                                        required: "Employee code is required",
                                        pattern: { value: /^[0-9]{5}$/, message: "5 Digits Required" }
                                    })}
                                    className={clsx("input-field w-full p-2 rounded-md bg-background border", errors.employee_code ? "border-destructive" : "border-border")}
                                    placeholder="12345"
                                />
                                {errors.employee_code && <span className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">{(errors.employee_code as any).message}</span>}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPendingStudent || isPendingEmployee}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-black h-11 px-4 py-2 mt-6 active:scale-[0.98] disabled:opacity-50 gap-2 shadow-xl shadow-primary/20"
                    >
                        {(isPendingStudent || isPendingEmployee) ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Complete Registration"}
                    </button>

                    <div className="text-center text-sm mt-4">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <button type="button" onClick={() => navigate('/login')} className="text-primary hover:underline font-medium">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
