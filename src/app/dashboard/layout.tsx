"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    FlaskConical, Home, TestTubes, GraduationCap, Bot, Trophy,
    UserCircle, Search, Bell, Menu, LogOut, Settings,
    PanelLeftClose, PanelLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const navItems = [
    { icon: Home, label: "Trang chủ", href: "/dashboard", active: true },
    { icon: FlaskConical, label: "Phòng thí nghiệm", href: "#" },
    { icon: TestTubes, label: "Phòng thực hành", href: "#" },
    { icon: GraduationCap, label: "Lớp học của tôi", href: "#" },
    { icon: Bot, label: "AI Tutor", href: "#" },
    { icon: Trophy, label: "Bảng xếp hạng", href: "#" },
    { icon: UserCircle, label: "Hồ sơ", href: "#" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    const fetchProfile = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        let { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        // Auto-create profile if trigger didn't fire (race condition / first login)
        if (!data) {
            const name =
                user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                user.email?.split("@")[0] ||
                "Người dùng";
            const role = user.user_metadata?.role || "student";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: upserted } = await (supabase as any)
                .from("profiles")
                .upsert({
                    id: user.id,
                    name,
                    email: user.email ?? "",
                    role: (role as string) || "student",
                    xp: 0,
                    streak: 0,
                    level: 1,
                })
                .select()
                .single();

            if (upserted) data = upserted;
        }

        if (data) {
            setProfile(data);
        } else {
            // Still couldn't load profile — redirect to login
            router.push("/login");
        }
    }, [supabase, router]);

    const fetchUnreadNotifications = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { count } = await supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("read", false);

        setUnreadCount(count ?? 0);
    }, [supabase]);

    useEffect(() => {
        setMounted(true);
        fetchProfile();
        fetchUnreadNotifications();
    }, [fetchProfile, fetchUnreadNotifications]);

    // Realtime: subscribe to notifications changes
    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            channel = supabase
                .channel("notifications-changes")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "notifications",
                        filter: `user_id=eq.${user.id}`,
                    },
                    () => {
                        fetchUnreadNotifications();
                    }
                )
                .subscribe();
        };

        setupRealtime();
        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [supabase, fetchUnreadNotifications]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    if (!mounted || !profile) {
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

    const initials = profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(-2)
        .toUpperCase();

    const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
        <div className="flex flex-col h-full">
            <div className={`flex items-center h-16 px-4 border-b ${collapsed && !mobile ? "justify-center" : "gap-2.5"}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25">
                    <FlaskConical className="w-5 h-5 text-white" />
                </div>
                {(!collapsed || mobile) && (
                    <span className="text-lg font-bold gradient-text">EduLab</span>
                )}
            </div>

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
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${item.active ? "text-primary" : "group-hover:text-foreground"}`} />
                        {(!collapsed || mobile) && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

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
            <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r bg-card transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"}`}>
                <SidebarContent />
            </aside>

            <div className={`transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}>
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 h-16 border-b bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between h-full px-4 sm:px-6">
                        <div className="flex items-center gap-3">
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

                            <div className="hidden sm:flex relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm thí nghiệm, bài học..."
                                    className="w-64 pl-9 h-9 bg-muted/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />

                            <Button variant="ghost" size="icon" className="relative rounded-full">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-full">
                                        <Avatar className="w-7 h-7">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white text-xs font-medium">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                                            {profile.name}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{profile.name}</span>
                                            <span className="text-xs text-muted-foreground font-normal">{profile.email}</span>
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

                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
