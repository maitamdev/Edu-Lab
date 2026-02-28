"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    FlaskConical, Microscope, Atom, Dna,
    ArrowRight, Clock, Star, Play, TestTubes,
    Code2, Loader2, Beaker, Zap, Flame, Award,
    TrendingUp, Sparkles, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserExperiment = Database["public"]["Tables"]["user_experiments"]["Row"] & {
    experiments: Database["public"]["Tables"]["experiments"]["Row"] | null;
};

const iconMap: Record<string, React.ElementType> = {
    Atom, Beaker, Dna, FlaskConical, Code2, Microscope,
};

const subjectConfig: Record<string, { gradient: string; glow: string; badge: string }> = {
    "Vật Lý": { gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-500/40", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
    "Hóa Học": { gradient: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/40", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    "Sinh Học": { gradient: "from-emerald-500 to-green-500", glow: "shadow-emerald-500/40", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    "Lập trình": { gradient: "from-orange-500 to-red-500", glow: "shadow-orange-500/40", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
};

function timeAgo(dateStr: string) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} giờ trước`;
    const diffDays = Math.floor(diffHrs / 24);
    return diffDays === 1 ? "Hôm qua" : `${diffDays} ngày trước`;
}

export default function DashboardPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [recentExperiments, setRecentExperiments] = useState<UserExperiment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profileData) setProfile(profileData);

        const { data: expData } = await supabase.from("user_experiments").select("*, experiments(*)").eq("user_id", user.id).order("last_accessed_at", { ascending: false }).limit(4);
        if (expData) setRecentExperiments(expData as UserExperiment[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        let profileChannel: ReturnType<typeof supabase.channel> | null = null;
        let expChannel: ReturnType<typeof supabase.channel> | null = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            profileChannel = supabase.channel("profile-rt")
                .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
                    (payload) => setProfile(payload.new as Profile))
                .subscribe();

            expChannel = supabase.channel("exp-rt")
                .on("postgres_changes", { event: "*", schema: "public", table: "user_experiments", filter: `user_id=eq.${user.id}` },
                    () => fetchData())
                .subscribe();
        };

        setupRealtime();
        return () => {
            if (profileChannel) supabase.removeChannel(profileChannel);
            if (expChannel) supabase.removeChannel(expChannel);
        };
    }, [supabase, fetchData]);

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                        <div className="absolute inset-0 w-10 h-10 animate-ping rounded-full bg-violet-500/20" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    const firstName = profile.name.split(" ").pop() || profile.name;
    const currentLevel = Math.floor(profile.xp / 500) + 1;
    const xpInLevel = profile.xp % 500;
    const xpPercent = Math.round((xpInLevel / 500) * 100);
    const levelBadge = currentLevel <= 3 ? "Học sinh mới" : currentLevel <= 6 ? "Nhà khoa học" : currentLevel <= 10 ? "Chuyên gia" : "Tiến sĩ EduLab";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)" }}>
                {/* Decorative orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-white/70 text-sm font-medium">
                                {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                            Chào mừng trở lại, {firstName}! 👋
                        </h1>
                        <p className="text-white/70 text-sm sm:text-base">
                            Tiếp tục hành trình khám phá khoa học của bạn.
                        </p>
                    </div>

                    {/* Mini XP badge */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div>
                            <p className="text-white text-xl font-bold">{profile.xp.toLocaleString()} XP</p>
                            <p className="text-white/60 text-xs">Lv.{currentLevel} · {levelBadge}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Streak */}
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:border-orange-300/50 dark:hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">🔥 Chuỗi ngày học</p>
                            <p className="text-4xl font-black text-orange-500">{profile.streak}</p>
                            <p className="text-xs text-muted-foreground mt-1">ngày liên tiếp</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min((profile.streak / 30) * 100, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{30 - (profile.streak % 30)} ngày nữa được huy hiệu</p>
                </div>

                {/* XP */}
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:border-violet-300/50 dark:hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">⚡ Điểm kinh nghiệm</p>
                            <p className="text-4xl font-black text-violet-500">{profile.xp.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">XP tổng cộng</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                            style={{ width: `${xpPercent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{500 - xpInLevel} XP nữa lên Lv.{currentLevel + 1}</p>
                </div>

                {/* Level */}
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:border-amber-300/50 dark:hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">🏆 Cấp độ</p>
                            <p className="text-4xl font-black text-amber-500">Lv.{currentLevel}</p>
                            <Badge className="mt-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0 text-[10px]">
                                <Star className="w-2.5 h-2.5 mr-1 fill-current" />{levelBadge}
                            </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`flex-1 h-1 rounded-full ${i < Math.min(currentLevel, 5) ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-muted"}`} />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Top 15% học sinh</p>
                </div>
            </div>

            {/* Quick Actions + Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 rounded-2xl border bg-card p-5">
                    <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                        </span>
                        Hành động nhanh
                    </h2>
                    <div className="space-y-3">
                        {[
                            { icon: FlaskConical, label: "Bắt đầu thí nghiệm mới", color: "from-violet-500 to-blue-500", shadow: "shadow-violet-500/25", isPrimary: true },
                            { icon: TestTubes, label: "Vào phòng thực hành", color: "from-blue-500 to-cyan-500", iconColor: "text-blue-500" },
                            { icon: Microscope, label: "Xem bài học mới", color: "from-emerald-500 to-green-500", iconColor: "text-emerald-500" },
                        ].map((action, i) => (
                            <Button key={i} variant={action.isPrimary ? "default" : "outline"}
                                className={`w-full h-12 justify-start text-sm rounded-xl group border-2 ${action.isPrimary
                                        ? `bg-gradient-to-r ${action.color} text-white border-0 shadow-lg ${action.shadow} hover:opacity-90`
                                        : "hover:bg-muted"
                                    }`}>
                                <action.icon className={`w-4 h-4 mr-3 flex-shrink-0 ${action.isPrimary ? "text-white" : action.iconColor}`} />
                                <span className="flex-1 text-left">{action.label}</span>
                                <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${action.isPrimary ? "text-white/70" : "text-muted-foreground"}`} />
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Level Progress */}
                <div className="lg:col-span-3 rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            </span>
                            Tiến độ cấp độ
                        </h2>
                        <Badge variant="secondary" className="text-[10px] gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Realtime
                        </Badge>
                    </div>

                    {/* Level visual */}
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex flex-col items-center justify-center shadow-xl shadow-amber-500/30">
                                <span className="text-white text-xs font-bold opacity-80">Level</span>
                                <span className="text-white text-3xl font-black leading-none">{currentLevel}</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl blur opacity-20" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">{levelBadge}</span>
                                <span className="text-xs text-muted-foreground">{xpInLevel} / 500 XP</span>
                            </div>
                            <div className="relative">
                                <Progress value={xpPercent} className="h-3" />
                                <div className="absolute inset-0 h-3 rounded-full overflow-hidden pointer-events-none">
                                    <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${xpPercent}%`, opacity: 0.8 }} />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">
                                Cần thêm <strong className="text-foreground">{500 - xpInLevel} XP</strong> để lên Lv.{currentLevel + 1}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { val: profile.streak, label: "Ngày streak", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", icon: "🔥" },
                            { val: profile.xp.toLocaleString(), label: "Tổng XP", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30", icon: "⚡" },
                            { val: recentExperiments.length, label: "Thí nghiệm", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: "🧪" },
                        ].map((stat, i) => (
                            <div key={i} className={`${stat.bg} rounded-xl p-3 text-center`}>
                                <div className="text-lg font-black">{stat.icon}</div>
                                <div className={`text-xl font-extrabold ${stat.color}`}>{stat.val}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Experiments */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Thí nghiệm gần đây</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {recentExperiments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed p-12 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-950/50 dark:to-blue-950/50 flex items-center justify-center mx-auto">
                                <FlaskConical className="w-10 h-10 text-violet-400" />
                            </div>
                        </div>
                        <h3 className="font-bold text-base mb-1">Chưa có thí nghiệm nào</h3>
                        <p className="text-sm text-muted-foreground mb-5">Hãy bắt đầu thí nghiệm đầu tiên của bạn!</p>
                        <Button className="bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0 rounded-xl shadow-lg shadow-violet-500/25 hover:opacity-90">
                            <FlaskConical className="w-4 h-4 mr-2" />Bắt đầu ngay
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentExperiments.map((ue) => {
                            const exp = ue.experiments;
                            if (!exp) return null;
                            const IconComp = iconMap[exp.icon ?? "FlaskConical"] ?? FlaskConical;
                            const cfg = subjectConfig[exp.subject] ?? subjectConfig["Vật Lý"];

                            return (
                                <div key={ue.id}
                                    className="group relative rounded-2xl border bg-card overflow-hidden hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                                    {/* Top gradient accent */}
                                    <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg ${cfg.glow} group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComp className="w-6 h-6 text-white" />
                                                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity`} />
                                            </div>
                                            {ue.completed ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-[10px] rounded-lg">
                                                    ✓ Hoàn thành
                                                </Badge>
                                            ) : (
                                                <span className="text-sm font-bold text-muted-foreground">{ue.progress}%</span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{exp.title}</h3>
                                            <Badge className={`mt-1.5 ${cfg.badge} border-0 text-[10px] rounded-md`}>{exp.subject}</Badge>
                                        </div>

                                        <div>
                                            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${cfg.gradient} rounded-full transition-all duration-700`}
                                                    style={{ width: `${ue.progress}%` }} />
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                                                <Clock className="w-3 h-3" />{timeAgo(ue.last_accessed_at)}
                                            </div>
                                        </div>

                                        <Button size="sm"
                                            className={`w-full h-8 text-xs rounded-xl bg-gradient-to-r ${cfg.gradient} text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-md`}>
                                            <Play className="w-3 h-3 mr-1" />
                                            {ue.completed ? "Xem lại" : "Tiếp tục"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
