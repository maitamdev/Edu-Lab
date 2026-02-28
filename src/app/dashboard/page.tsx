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
    "Vat Ly": { gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-500/40", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
    "Hoa Hoc": { gradient: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/40", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    "Sinh Hoc": { gradient: "from-emerald-500 to-green-500", glow: "shadow-emerald-500/40", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    "Lap trinh": { gradient: "from-orange-500 to-red-500", glow: "shadow-orange-500/40", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
};

function getSubjectConfig(subject: string) {
    const map: Record<string, string> = {
        "V\u1eadt L\u00fd": "Vat Ly",
        "H\u00f3a H\u1ecdc": "Hoa Hoc",
        "Sinh H\u1ecdc": "Sinh Hoc",
        "L\u1eadp tr\u00ecnh": "Lap trinh",
    };
    return subjectConfig[map[subject]] ?? subjectConfig["Vat Ly"];
}

function timeAgo(dateStr: string) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} ph\u00fat tr\u01b0\u1edbc`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} gi\u1edd tr\u01b0\u1edbc`;
    const diffDays = Math.floor(diffHrs / 24);
    return diffDays === 1 ? "H\u00f4m qua" : `${diffDays} ng\u00e0y tr\u01b0\u1edbc`;
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
                    (payload) => setProfile(payload.new as Profile)).subscribe();
            expChannel = supabase.channel("exp-rt")
                .on("postgres_changes", { event: "*", schema: "public", table: "user_experiments", filter: `user_id=eq.${user.id}` },
                    () => fetchData()).subscribe();
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

    const nameParts = profile.name.split(" ");
    const firstName = nameParts[nameParts.length - 1] || profile.name;
    const currentLevel = Math.floor(profile.xp / 500) + 1;
    const xpInLevel = profile.xp % 500;
    const xpPercent = Math.round((xpInLevel / 500) * 100);
    const levelBadge = currentLevel <= 3 ? "Hoc sinh moi" : currentLevel <= 6 ? "Nha khoa hoc" : currentLevel <= 10 ? "Chuyen gia" : "Tien si EduLab";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* ── Premium Hero Banner ── */}
            <div className="relative overflow-hidden rounded-3xl"
                style={{
                    background: "linear-gradient(135deg, #130030 0%, #1e1060 28%, #0f2d6b 62%, #051a3a 100%)",
                    minHeight: 190,
                }}>
                {/* Glow orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: "absolute", top: "-30%", left: "-10%", width: "55%", height: "200%", background: "radial-gradient(circle, rgba(139,92,246,0.75) 0%, transparent 68%)", filter: "blur(52px)", borderRadius: "50%" }} />
                    <div style={{ position: "absolute", top: "-20%", right: "5%", width: "45%", height: "180%", background: "radial-gradient(circle, rgba(59,130,246,0.65) 0%, transparent 68%)", filter: "blur(56px)", borderRadius: "50%" }} />
                    <div style={{ position: "absolute", bottom: "-30%", left: "35%", width: "40%", height: "150%", background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 68%)", filter: "blur(48px)", borderRadius: "50%" }} />
                </div>
                {/* Dot grid overlay */}
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)", backgroundSize: "24px 24px" }} />
                {/* Top shimmer */}
                <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.6) 35%, rgba(147,197,253,0.5) 65%, transparent 100%)", opacity: 0.5 }} />

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                        {/* Date pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium"
                            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.45)" }}>
                            <Sparkles className="w-3 h-3" style={{ color: "#c4b5fd" }} />
                            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </div>

                        {/* Heading */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                                Chao mung tro lai,{" "}
                                <span style={{ background: "linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    {firstName}!
                                </span>
                                {" "}👋
                            </h1>
                            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
                                Kham pha khoa hoc moi ngay — tien bo khong ngung.
                            </p>
                        </div>

                        {/* CTA button */}
                        <div className="pt-1">
                            <button
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                                style={{
                                    background: "linear-gradient(135deg, rgba(124,58,237,0.55) 0%, rgba(59,130,246,0.4) 100%)",
                                    border: "1px solid rgba(167,139,250,0.25)",
                                    backdropFilter: "blur(12px)",
                                    boxShadow: "0 0 28px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                                }}>
                                <FlaskConical className="w-4 h-4" style={{ color: "#c4b5fd" }} />
                                Bat dau thi nghiem ngay
                                <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Level orb + stat pills */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Level orb */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, rgba(124,58,237,0.55), rgba(59,130,246,0.45))",
                                    border: "1px solid rgba(167,139,250,0.2)",
                                    backdropFilter: "blur(16px)",
                                    boxShadow: "0 0 45px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
                                }}>
                                <span style={{ color: "rgba(196,181,253,0.6)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>LEVEL</span>
                                <span className="text-white text-3xl font-black leading-tight">{currentLevel}</span>
                            </div>
                            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(59,130,246,0.3))", filter: "blur(6px)", opacity: 0.6 }} />
                        </div>

                        {/* Stat pills */}
                        <div className="space-y-2">
                            {[
                                { icon: Zap, label: `${profile.xp.toLocaleString()} XP`, iconColor: "#fde68a" },
                                { icon: Flame, label: `${profile.streak} ngay streak`, iconColor: "#fdba74" },
                                { icon: Star, label: levelBadge, iconColor: "#c4b5fd" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-white"
                                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
                                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.iconColor }} />
                                    <span style={{ color: i === 2 ? "#c4b5fd" : "rgba(255,255,255,0.85)", fontSize: i === 2 ? "11px" : "13px" }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Streak */}
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:border-orange-300/50 dark:hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5 cursor-pointer">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Chuoi ngay hoc</p>
                            <p className="text-5xl font-black text-orange-500 leading-none">{profile.streak}</p>
                            <p className="text-xs text-muted-foreground mt-2">ngay lien tiep</p>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-3">
                            <Flame className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((profile.streak / 30) * 100, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{30 - (profile.streak % 30)} ngay nua duoc huy hieu</p>
                </div>

                {/* XP */}
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:border-violet-300/50 dark:hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-0.5 cursor-pointer">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Diem kinh nghiem</p>
                            <p className="text-5xl font-black text-violet-500 leading-none">{profile.xp.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-2">XP tong cong</p>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-3">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: `${xpPercent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{500 - xpInLevel} XP nua len Lv.{currentLevel + 1}</p>
                </div>

                {/* Level */}
                <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:border-amber-300/50 dark:hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5 cursor-pointer">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                    <div className="flex items-start justify-between relative">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Cap do</p>
                            <p className="text-5xl font-black text-amber-500 leading-none">Lv.{currentLevel}</p>
                            <Badge className="mt-2 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0 text-[10px]">
                                <Star className="w-2.5 h-2.5 mr-1 fill-current" />{levelBadge}
                            </Badge>
                        </div>
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 p-3">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < Math.min(currentLevel, 5) ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-muted"}`} />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Top 15% hoc sinh</p>
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
                        Hanh dong nhanh
                    </h2>
                    <div className="space-y-3">
                        {[
                            { icon: FlaskConical, label: "Bat dau thi nghiem moi", isPrimary: true },
                            { icon: TestTubes, label: "Vao phong thuc hanh", iconColor: "text-blue-500" },
                            { icon: Microscope, label: "Xem bai hoc moi", iconColor: "text-emerald-500" },
                        ].map((action, i) => (
                            <Button key={i} variant={action.isPrimary ? "default" : "outline"}
                                className={`w-full h-12 justify-start text-sm rounded-xl group gap-3 ${action.isPrimary
                                    ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0 shadow-lg shadow-violet-500/25 hover:opacity-90"
                                    : "border-2 hover:bg-muted"}`}>
                                <action.icon className={`w-4 h-4 flex-shrink-0 ${action.isPrimary ? "text-white" : action.iconColor}`} />
                                <span className="flex-1 text-left">{action.label}</span>
                                <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${action.isPrimary ? "text-white/60" : "text-muted-foreground"}`} />
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
                            Tien do cap do
                        </h2>
                        <Badge variant="secondary" className="text-[10px] gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Realtime
                        </Badge>
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex flex-col items-center justify-center shadow-xl shadow-amber-500/30">
                                <span className="text-white text-[10px] font-bold opacity-70 uppercase tracking-wider">Level</span>
                                <span className="text-white text-3xl font-black leading-none">{currentLevel}</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl blur opacity-20 pointer-events-none" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">{levelBadge}</span>
                                <span className="text-xs text-muted-foreground">{xpInLevel} / 500 XP</span>
                            </div>
                            <Progress value={xpPercent} className="h-3" />
                            <p className="text-xs text-muted-foreground mt-1.5">
                                Can them <strong className="text-foreground">{500 - xpInLevel} XP</strong> de len Lv.{currentLevel + 1}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { val: profile.streak, label: "Ngay streak", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", emoji: "🔥" },
                            { val: profile.xp.toLocaleString(), label: "Tong XP", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30", emoji: "⚡" },
                            { val: recentExperiments.length, label: "Thi nghiem", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", emoji: "🧪" },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
                                <div className="text-xl">{s.emoji}</div>
                                <div className={`text-xl font-extrabold ${s.color}`}>{s.val}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Experiments */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Thi nghiem gan day</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Xem tat ca <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {recentExperiments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-950/50 dark:to-blue-950/50 flex items-center justify-center mx-auto mb-4">
                            <FlaskConical className="w-10 h-10 text-violet-400" />
                        </div>
                        <h3 className="font-bold text-base mb-1">Chua co thi nghiem nao</h3>
                        <p className="text-sm text-muted-foreground mb-5">Hay bat dau thi nghiem dau tien cua ban!</p>
                        <Button className="bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0 rounded-xl shadow-lg shadow-violet-500/25 hover:opacity-90">
                            <FlaskConical className="w-4 h-4 mr-2" />Bat dau ngay
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentExperiments.map((ue) => {
                            const exp = ue.experiments;
                            if (!exp) return null;
                            const IconComp = iconMap[exp.icon ?? "FlaskConical"] ?? FlaskConical;
                            const cfg = getSubjectConfig(exp.subject);
                            return (
                                <div key={ue.id} className="group relative rounded-2xl border bg-card overflow-hidden hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                                    <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg ${cfg.glow} group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComp className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-muted-foreground">{ue.progress}%</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{exp.title}</h3>
                                            <Badge className={`mt-1.5 ${cfg.badge} border-0 text-[10px] rounded-md`}>{exp.subject}</Badge>
                                        </div>
                                        <div>
                                            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${cfg.gradient} rounded-full transition-all duration-700`} style={{ width: `${ue.progress}%` }} />
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                                                <Clock className="w-3 h-3" />{timeAgo(ue.last_accessed_at)}
                                            </div>
                                        </div>
                                        <Button size="sm" className={`w-full h-8 text-xs rounded-xl bg-gradient-to-r ${cfg.gradient} text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-md`}>
                                            <Play className="w-3 h-3 mr-1" />{ue.completed ? "Xem lai" : "Tiep tuc"}
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
