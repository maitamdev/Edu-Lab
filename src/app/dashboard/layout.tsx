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
    ChevronLeft, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const navItems = [
    { icon: Home, label: "Trang chủ", href: "/dashboard", color: "text-violet-400" },
    { icon: FlaskConical, label: "Phòng thí nghiệm", href: "#", color: "text-blue-400" },
    { icon: TestTubes, label: "Phòng thực hành", href: "#", color: "text-cyan-400" },
    { icon: GraduationCap, label: "Lớp học của tôi", href: "#", color: "text-emerald-400" },
    { icon: Bot, label: "AI Tutor", href: "#", color: "text-pink-400" },
    { icon: Trophy, label: "Bảng xếp hạng", href: "#", color: "text-amber-400" },
    { icon: UserCircle, label: "Hồ sơ", href: "#", color: "text-slate-400" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeNav, setActiveNav] = useState(0);
    const supabase = createClient();

    const fetchProfile = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        let { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

        if (!data) {
            const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Người dùng";
            const role = user.user_metadata?.role || "student";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: upserted } = await (supabase as any).from("profiles").upsert({
                id: user.id, name, email: user.email ?? "", role, xp: 0, streak: 0, level: 1,
            }).select().single();
            if (upserted) data = upserted;
        }

        if (data) setProfile(data);
        else router.push("/login");
    }, [supabase, router]);

    const fetchUnreadNotifications = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false);
        setUnreadCount(count ?? 0);
    }, [supabase]);

    useEffect(() => { setMounted(true); fetchProfile(); fetchUnreadNotifications(); }, [fetchProfile, fetchUnreadNotifications]);

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;
        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            channel = supabase.channel("notifications-changes")
                .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => { fetchUnreadNotifications(); })
                .subscribe();
        };
        setupRealtime();
        return () => { if (channel) supabase.removeChannel(channel); };
    }, [supabase, fetchUnreadNotifications]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    if (!mounted || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-violet-500/50 animate-pulse">
                            <FlaskConical className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-semibold text-lg">EduLab</p>
                        <p className="text-white/50 text-sm mt-1">Đang tải...</p>
                    </div>
                </div>
            </div>
        );
    }

    const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(-2).toUpperCase();

    const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
        <div className="flex flex-col h-full"
            style={mobile ? { background: "linear-gradient(180deg, #1a1040 0%, #0d0d1a 100%)" } : {}}>
            {/* Logo */}
            <div className={`flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0 ${collapsed && !mobile ? "justify-center" : "gap-3"}`}>
                <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
                        <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl blur opacity-30" />
                </div>
                {(!collapsed || mobile) && (
                    <div>
                        <span className="text-lg font-extrabold text-white tracking-tight">EduLab</span>
                        <div className="text-[10px] text-violet-400 font-medium leading-none">Thí Nghiệm Ảo</div>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item, i) => {
                    const isActive = i === activeNav;
                    return (
                        <Link key={i} href={item.href}
                            onClick={() => setActiveNav(i)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${collapsed && !mobile ? "justify-center" : ""
                                } ${isActive
                                    ? "bg-gradient-to-r from-violet-500/20 to-blue-500/10 text-white border border-violet-500/20"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}
                            title={collapsed && !mobile ? item.label : undefined}>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-violet-400 to-blue-400 rounded-full" />
                            )}
                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-all ${isActive ? item.color : "group-hover:" + item.color}`} />
                            {(!collapsed || mobile) && (
                                <span className="flex-1">{item.label}</span>
                            )}
                            {isActive && !collapsed && (
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User mini card at bottom */}
            {(!collapsed || mobile) && (
                <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                            <p className="text-xs text-white/40 truncate">{profile.email}</p>
                        </div>
                        <Settings className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </div>
                </div>
            )}

            {/* Collapse toggle (desktop only) */}
            {!mobile && (
                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm ${collapsed ? "justify-center" : ""}`}>
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Thu gọn</span></>}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar – dark themed */}
            <aside
                className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r border-white/5 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"}`}
                style={{ background: "linear-gradient(180deg, #1a1040 0%, #0d0d1a 100%)" }}>
                <SidebarContent />
            </aside>

            <div className={`transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}>
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 h-16 border-b border-border/50 backdrop-blur-xl bg-background/80">
                    <div className="flex items-center justify-between h-full px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            {/* Mobile menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-0 border-0">
                                    <SidebarContent mobile />
                                </SheetContent>
                            </Sheet>

                            <div className="hidden sm:flex relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Tìm kiếm thí nghiệm, bài học..." className="w-72 pl-9 h-9 bg-muted/50 rounded-xl text-sm" />
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <ThemeToggle />

                            <Button variant="ghost" size="icon" className="relative rounded-xl">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-xl hover:bg-muted">
                                        <Avatar className="w-7 h-7">
                                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs font-bold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">{profile.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold">{profile.name}</span>
                                            <span className="text-xs text-muted-foreground font-normal truncate">{profile.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="rounded-lg"><UserCircle className="w-4 h-4 mr-2" />Hồ sơ</DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg"><Settings className="w-4 h-4 mr-2" />Cài đặt</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400 rounded-lg">
                                        <LogOut className="w-4 h-4 mr-2" />Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">{children}</main>
            </div>
        </div>
    );
}
