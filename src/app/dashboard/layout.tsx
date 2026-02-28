"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    FlaskConical,
    Home,
    TestTubes,
    GraduationCap,
    Bot,
    Trophy,
    UserCircle,
    Search,
    Bell,
    Menu,
    LogOut,
    Settings,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";

interface UserData {
    name: string;
    email: string;
    role: string;
}

const navItems = [
    { icon: Home, label: "Trang chủ", href: "/dashboard", active: true },
    { icon: FlaskConical, label: "Phòng thí nghiệm", href: "#" },
    { icon: TestTubes, label: "Phòng thực hành", href: "#" },
    { icon: GraduationCap, label: "Lớp học của tôi", href: "#" },
    { icon: Bot, label: "AI Tutor", href: "#" },
    { icon: Trophy, label: "Bảng xếp hạng", href: "#" },
    { icon: UserCircle, label: "Hồ sơ", href: "#" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const auth = localStorage.getItem("edulab_auth");
        const userData = localStorage.getItem("edulab_user");
        if (!auth) {
            router.push("/login");
            return;
        }
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("edulab_auth");
        localStorage.removeItem("edulab_user");
        router.push("/login");
    };

    if (!mounted || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center animate-pulse">
                        <FlaskConical className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-muted-foreground text-sm">Đang tải...</p>
                </div>
            </div>
        );
    }

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(-2)
        .toUpperCase();

    const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center h-16 px-4 border-b ${collapsed && !mobile ? "justify-center" : "gap-2.5"}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25">
                    <FlaskConical className="w-5 h-5 text-white" />
                </div>
                {(!collapsed || mobile) && (
                    <span className="text-lg font-bold gradient-text">EduLab</span>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${item.active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            } ${collapsed && !mobile ? "justify-center" : ""}`}
                        title={collapsed && !mobile ? item.label : undefined}
                    >
                        <item.icon
                            className={`w-5 h-5 flex-shrink-0 ${item.active ? "text-primary" : "group-hover:text-foreground"
                                }`}
                        />
                        {(!collapsed || mobile) && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Collapse toggle (desktop only) */}
            {!mobile && (
                <div className="p-3 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full ${collapsed ? "justify-center" : "justify-start"}`}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? (
                            <PanelLeft className="w-5 h-5" />
                        ) : (
                            <>
                                <PanelLeftClose className="w-5 h-5 mr-2" />
                                <span>Thu gọn</span>
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r bg-card transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Main content area */}
            <div
                className={`transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"
                    }`}
            >
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 h-16 border-b bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between h-full px-4 sm:px-6">
                        {/* Left: Mobile menu + Search */}
                        <div className="flex items-center gap-3">
                            {/* Mobile menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-0">
                                    <SidebarContent mobile />
                                </SheetContent>
                            </Sheet>

                            {/* Search */}
                            <div className="hidden sm:flex relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm thí nghiệm, bài học..."
                                    className="w-64 pl-9 h-9 bg-muted/50"
                                />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />

                            <Button variant="ghost" size="icon" className="relative rounded-full">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-full"
                                    >
                                        <Avatar className="w-7 h-7">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white text-xs font-medium">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                                            {user.name}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{user.name}</span>
                                            <span className="text-xs text-muted-foreground font-normal">
                                                {user.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <UserCircle className="w-4 h-4 mr-2" />
                                        Hồ sơ
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Cài đặt
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
