"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    FlaskConical, Home, TestTubes, GraduationCap, Bot, Trophy,
    UserCircle, Bell, Menu, LogOut, Settings,
    ChevronLeft, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: FlaskConical, label: "Lab Simulator", href: "#" },
    { icon: TestTubes, label: "Practice Lab", href: "#" },
    { icon: GraduationCap, label: "My Courses", href: "#" },
    { icon: Bot, label: "AI Tutor", href: "#" },
    { icon: Trophy, label: "Leaderboard", href: "#" },
    { icon: UserCircle, label: "Profile", href: "#" },
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
            const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: upserted } = await (supabase as any).from("profiles").upsert({
                id: user.id, name, email: user.email ?? "", role: user.user_metadata?.role || "student", xp: 0, streak: 0, level: 1,
            }).select().single();
            if (upserted) data = upserted;
        }
        if (data) setProfile(data); else router.push("/login");
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
        const setup = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            channel = supabase.channel("notif-rt").on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => fetchUnreadNotifications()).subscribe();
        };
        setup();
        return () => { if (channel) supabase.removeChannel(channel); };
    }, [supabase, fetchUnreadNotifications]);

    const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); router.refresh(); };

    if (!mounted || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center animate-pulse shadow-xl shadow-violet-200">
                        <FlaskConical className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(-2).toUpperCase();

    const SidebarNav = ({ mobile = false }: { mobile?: boolean }) => (
        <div className="flex flex-col h-full bg-white">
            {/* Logo */}
            <div className={`flex items-center h-16 px-5 border-b border-gray-100 ${collapsed && !mobile ? "justify-center" : "gap-3"}`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
                    <FlaskConical className="w-5 h-5 text-white" />
                </div>
                {(!collapsed || mobile) && (
                    <span className="text-lg font-bold text-gray-800 tracking-tight">EduLab</span>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item, i) => {
                    const isActive = i === activeNav;
                    return (
                        <Link key={i} href={item.href} onClick={() => setActiveNav(i)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed && !mobile ? "justify-center" : ""} ${isActive
                                ? "bg-violet-50 text-violet-700"
                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                }`}
                            title={collapsed && !mobile ? item.label : undefined}>
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-violet-600" : ""}`} />
                            {(!collapsed || mobile) && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-gray-100">
                {(!collapsed || mobile) && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">EduLab</span>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition text-sm ${collapsed && !mobile ? "justify-center" : ""}`}>
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Thu gon</span></>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r border-gray-200 bg-white transition-all duration-300 shadow-sm ${collapsed ? "w-[72px]" : "w-60"}`}>
                <SidebarNav />
            </aside>

            <div className={`transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-60"}`}>
                {/* Top bar */}
                <header className="sticky top-0 z-20 h-14 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between h-full px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-60 p-0 border-0"><SidebarNav mobile /></SheetContent>
                            </Sheet>
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button variant="ghost" size="icon" className="relative rounded-full text-gray-500">
                                <Settings className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="relative rounded-full text-gray-500">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[16px] h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center px-0.5">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 rounded-full">
                                        <Avatar className="w-8 h-8 border-2 border-violet-200">
                                            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white text-xs font-bold">{initials}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                    <DropdownMenuLabel>
                                        <span className="font-semibold">{profile.name}</span>
                                        <p className="text-xs text-muted-foreground font-normal">{profile.email}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><UserCircle className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
                                    <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500"><LogOut className="w-4 h-4 mr-2" />Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <main className="p-5 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
