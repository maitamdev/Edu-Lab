"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
    Loader2, Zap, Flame, Award,
    ArrowRight, Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserExperiment = Database["public"]["Tables"]["user_experiments"]["Row"] & {
    experiments: Database["public"]["Tables"]["experiments"]["Row"] | null;
};

function timeAgo(dateStr: string) {
    const d = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(d / 60000);
    if (m < 60) return `${m} phut truoc`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} gio truoc`;
    const dd = Math.floor(h / 24);
    return `${dd} ngay truoc`;
}

/* SVG Donut Chart */
function DonutChart({ value, max, size = 120 }: { value: number; max: number; size?: number }) {
    const pct = max > 0 ? value / max : 0;
    const r = 44;
    const c = 2 * Math.PI * r;
    const colors = [
        { offset: 0, pct: pct * 0.4, color: "#8b5cf6" },
        { offset: pct * 0.4, pct: pct * 0.35, color: "#a78bfa" },
        { offset: pct * 0.75, pct: pct * 0.25, color: "#ddd6fe" },
    ];

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
            {/* Colored segments */}
            {colors.map((seg, i) => (
                <circle key={i} cx="50" cy="50" r={r} fill="none"
                    stroke={seg.color} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${seg.pct * c} ${c}`}
                    strokeDashoffset={`${-seg.offset * c}`}
                    className="transition-all duration-1000" />
            ))}
        </svg>
    );
}

const defaultLabImages = ["/images/lab-1.png", "/images/lab-2.png", "/images/lab-3.png", "/images/lab-4.png"];

export default function DashboardPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [recentExperiments, setRecentExperiments] = useState<UserExperiment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (p) setProfile(p);
        const { data: e } = await supabase.from("user_experiments").select("*, experiments(*)").eq("user_id", user.id).order("last_accessed_at", { ascending: false }).limit(4);
        if (e) setRecentExperiments(e as UserExperiment[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        let pc: ReturnType<typeof supabase.channel> | null = null;
        let ec: ReturnType<typeof supabase.channel> | null = null;
        const setup = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            pc = supabase.channel("p-rt").on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, (pl) => setProfile(pl.new as Profile)).subscribe();
            ec = supabase.channel("e-rt").on("postgres_changes", { event: "*", schema: "public", table: "user_experiments", filter: `user_id=eq.${user.id}` }, () => fetchData()).subscribe();
        };
        setup();
        return () => { if (pc) supabase.removeChannel(pc); if (ec) supabase.removeChannel(ec); };
    }, [supabase, fetchData]);

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
        );
    }

    const firstName = profile.name.split(" ").pop() || profile.name;
    const currentLevel = Math.floor(profile.xp / 500) + 1;
    const xpInLevel = profile.xp % 500;
    const levelBadge = currentLevel <= 3 ? "Hoc sinh moi" : currentLevel <= 6 ? "Nha khoa hoc" : "Chuyen gia";

    return (
        <div className="space-y-6 max-w-6xl mx-auto">

            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(135deg, #ede9fe 0%, #e0d4fd 30%, #ddd6fe 50%, #c7d2fe 70%, #bfdbfe 100%)", minHeight: 180 }}>

                {/* 3D illustration on the right */}
                <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden sm:block">
                    <Image src="/images/hero-3d.png" alt="Science 3D" fill className="object-contain object-right-bottom" priority />
                </div>

                {/* Level badge - top right */}
                <div className="absolute top-5 right-5 sm:right-auto sm:right-[42%] z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex flex-col items-center justify-center border border-white/50">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Level</span>
                        <span className="text-xl font-black text-violet-600 leading-none">{currentLevel}</span>
                    </div>
                </div>

                <div className="relative z-10 p-7 sm:p-9 sm:max-w-[55%]">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
                        Chao mung tro lai, {firstName}!
                    </h1>
                    <p className="text-gray-500 text-sm mb-5">
                        Kham pha khoa hoc moi ngay...
                    </p>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 h-10 text-sm font-semibold shadow-lg">
                        Bat dau thi nghiem ngay
                    </Button>
                </div>
            </div>

            {/* ── Performance Overview + Level Progress ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Performance Overview */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="text-base font-bold text-gray-800 mb-5">Performance Overview</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Streak */}
                        <div className="rounded-2xl border border-gray-100 p-4 text-center bg-gray-50/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                                <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-xs text-gray-400 mb-1">Chuoi ngay hoc</p>
                            <p className="text-3xl font-black text-gray-800">{profile.streak}</p>
                        </div>
                        {/* XP */}
                        <div className="rounded-2xl border border-gray-100 p-4 text-center bg-gray-50/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-5 h-5 text-violet-500" />
                            </div>
                            <p className="text-xs text-gray-400 mb-1">Diem kinh nghiem</p>
                            <p className="text-3xl font-black text-gray-800">{profile.xp} XP</p>
                        </div>
                        {/* Level */}
                        <div className="rounded-2xl border border-gray-100 p-4 text-center bg-gray-50/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                                <Award className="w-5 h-5 text-amber-500" />
                            </div>
                            <p className="text-xs text-gray-400 mb-1">Cap do</p>
                            <p className="text-3xl font-black text-gray-800">Lv.{currentLevel}</p>
                        </div>
                    </div>
                </div>

                {/* Level Progress with Donut */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-800">Tien do cap do</h2>
                        <Badge className="bg-rose-50 text-rose-500 border-0 text-[10px] font-semibold rounded-full px-3">
                            Realtime
                        </Badge>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Donut Chart */}
                        <div className="relative flex-shrink-0">
                            <DonutChart value={xpInLevel} max={500} size={110} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 font-medium">XP</p>
                                    <p className="text-lg font-black text-gray-700">{xpInLevel}</p>
                                </div>
                            </div>
                        </div>
                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-0.5">{levelBadge}</h3>
                            <p className="text-xs text-gray-400 mb-1">{levelBadge}</p>
                            <p className="text-sm text-gray-500">{xpInLevel}/500 XP</p>
                        </div>
                    </div>
                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Streak</p>
                            <p className="text-xl font-bold text-gray-800">{profile.streak}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Total XP</p>
                            <p className="text-xl font-bold text-gray-800">{profile.xp} XP</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Experiments</p>
                            <p className="text-xl font-bold text-gray-800">{recentExperiments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Experiments ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-800">Thi nghiem gan day</h2>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 text-xs">
                        Xem tat ca <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </div>

                {recentExperiments.length === 0 ? (
                    /* Show 4 placeholder cards with lab images */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Pha che dung dich", date: "12/03/2023" },
                            { title: "Phan ung hoa hoc co ban", date: "12/03/2023" },
                            { title: "Phan ung hoa hoc co ban", date: "12/03/2023" },
                            { title: "Phan ung hoa dich", date: "13/03/2023" },
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                <div className="relative h-40 overflow-hidden">
                                    <Image src={defaultLabImages[i]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />{item.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentExperiments.map((ue, idx) => {
                            const exp = ue.experiments;
                            if (!exp) return null;
                            return (
                                <div key={ue.id} className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                    <div className="relative h-40 overflow-hidden">
                                        <Image src={defaultLabImages[idx % 4]} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{exp.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{timeAgo(ue.last_accessed_at)}
                                        </p>
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
