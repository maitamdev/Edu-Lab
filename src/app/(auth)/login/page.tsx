"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        setLoading(true);

        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check localStorage for registered user or use default
        const storedUser = localStorage.getItem("edulab_user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.email === email) {
                localStorage.setItem("edulab_auth", "true");
                router.push("/dashboard");
                return;
            }
        }

        // Default: accept any login
        localStorage.setItem(
            "edulab_user",
            JSON.stringify({
                name: "Học sinh EduLab",
                email,
                role: "student",
            })
        );
        localStorage.setItem("edulab_auth", "true");
        router.push("/dashboard");
    };

    const handleGoogleLogin = async () => {
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
                <h1 className="text-3xl font-bold tracking-tight">Đăng nhập</h1>
                <p className="text-muted-foreground">
                    Chào mừng trở lại! Nhập thông tin để tiếp tục.
                </p>
            </div>

            <Card className="border-0 shadow-xl shadow-purple-500/5">
                <form onSubmit={handleLogin}>
                    <CardHeader className="pb-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 text-sm font-medium"
                            onClick={handleGoogleLogin}
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
                            Đăng nhập bằng Google
                        </Button>
                    </CardHeader>

                    <div className="px-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Hoặc đăng nhập bằng email
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <a
                                    href="#"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
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
                                <LogIn className="w-5 h-5 mr-2" />
                            )}
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                >
                    Đăng ký miễn phí
                </Link>
            </p>
        </div>
    );
}
