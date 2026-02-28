"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    Loader2,
    User,
    GraduationCap,
    BookOpen,
    ShieldCheck,
} from "lucide-react";

const roles = [
    {
        value: "student",
        label: "Học sinh",
        icon: GraduationCap,
        description: "Học tập & thí nghiệm",
    },
    {
        value: "teacher",
        label: "Giáo viên",
        icon: BookOpen,
        description: "Quản lý lớp học",
    },
    {
        value: "admin",
        label: "Quản trị viên",
        icon: ShieldCheck,
        description: "Quản lý hệ thống",
    },
];

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);

        // Simulate registration delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Save user to localStorage
        const user = { name, email, role };
        localStorage.setItem("edulab_user", JSON.stringify(user));
        localStorage.setItem("edulab_auth", "true");

        router.push("/dashboard");
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        localStorage.setItem(
            "edulab_user",
            JSON.stringify({
                name: "Nguyễn Văn A",
                email: "nguyenvana@gmail.com",
                role: "student",
            })
        );
        localStorage.setItem("edulab_auth", "true");
        router.push("/dashboard");
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Đăng ký</h1>
                <p className="text-muted-foreground">
                    Tạo tài khoản miễn phí để bắt đầu khám phá.
                </p>
            </div>

            <Card className="border-0 shadow-xl shadow-purple-500/5">
                <form onSubmit={handleRegister}>
                    <CardHeader className="pb-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 text-sm font-medium"
                            onClick={handleGoogleRegister}
                            disabled={loading}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Đăng ký bằng Google
                        </Button>
                    </CardHeader>

                    <div className="px-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Hoặc đăng ký bằng email
                                </span>
                            </div>
                        </div>
                    </div>

                    <CardContent className="space-y-4 pt-6">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Họ và tên</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Role selection */}
                        <div className="space-y-2">
                            <Label>Vai trò</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {roles.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${role === r.value
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border hover:border-muted-foreground/30"
                                            }`}
                                    >
                                        <r.icon
                                            className={`w-5 h-5 ${role === r.value
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                                }`}
                                        />
                                        <span
                                            className={`text-xs font-medium ${role === r.value ? "text-primary" : "text-foreground"
                                                }`}
                                        >
                                            {r.label}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground hidden sm:block">
                                            {r.description}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25 border-0"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <UserPlus className="w-5 h-5 mr-2" />
                            )}
                            {loading ? "Đang tạo tài khoản..." : "Đăng ký miễn phí"}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                            Bằng việc đăng ký, bạn đồng ý với{" "}
                            <a href="#" className="text-primary hover:underline">
                                Điều khoản sử dụng
                            </a>{" "}
                            và{" "}
                            <a href="#" className="text-primary hover:underline">
                                Chính sách bảo mật
                            </a>{" "}
                            của EduLab.
                        </p>
                    </CardFooter>
                </form>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}
