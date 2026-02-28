"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Flame, Zap, Award, FlaskConical, Microscope,
    Atom, Beaker, Dna, ArrowRight, TrendingUp, Clock,
    Star, Play, TestTubes, Code2, Loader2,
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

const subjectGradient: Record<string, string> = {
    "Vật Lý": "from-violet-500 to-purple-600",
    "Hóa Học": "from-blue-500 to-cyan-500",
    "Sinh Học": "from-emerald-500 to-green-600",
    "Lập trình": "from-orange-500 to-red-500",
};

const subjectBg: Record<string, string> = {
    "Vật Lý": "bg-violet-50 dark:bg-violet-950/30",
    "Hóa Học": "bg-blue-50 dark:bg-blue-950/30",
    "Sinh Học": "bg-emerald-50 dark:bg-emerald-950/30",
    "Lập trình": "bg-orange-50 dark:bg-orange-950/30",
};

function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} giờ trước`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
}

export default function DashboardPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [recentExperiments, setRecentExperiments] = useState<UserExperiment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileData) setProfile(profileData);

        // Fetch recent user experiments with experiment details
        const { data: expData } = await supabase
            .from("user_experiments")
            .select("*, experiments(*)")
            .eq("user_id", user.id)
            .order("last_accessed_at", { ascending: false })
            .limit(4);

        if (expData) setRecentExperiments(expData as UserExperiment[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Realtime: subscribe to profile changes (XP, streak, level)
    useEffect(() => {
        let profileChannel: ReturnType<typeof supabase.channel> | null = null;
        let expChannel: ReturnType<typeof supabase.channel> | null = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            profileChannel = supabase
                .channel("profile-realtime")
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "profiles",
                        filter: `id=eq.${user.id}`,
                    },
                    (payload) => {
                        setProfile(payload.new as Profile);
                    }
                )
                .subscribe();

            expChannel = supabase
                .channel("experiments-realtime")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "user_experiments",
                        filter: `user_id=eq.${user.id}`,
                    },
                    () => {
                        fetchData();
                    }
                )
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
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    const firstName = profile.name.split(" ").pop() || profile.name;
    // Level: every 500 XP = 1 level
    const currentLevel = Math.floor(profile.xp / 500) + 1;
    const xpInLevel = profile.xp % 500;
    const xpPercent = Math.round((xpInLevel / 500) * 100);

    const levelBadgeLabel =
        currentLevel <= 3 ? "Học sinh mới" :
            currentLevel <= 5 ? "Nhà khoa học" :
                currentLevel <= 8 ? "Nhà khoa học trẻ" :
                    currentLevel <= 12 ? "Chuyên gia" : "Tiến sĩ EduLab";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Chào mừng trở lại, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Tiếp tục hành trình khám phá khoa học của bạn.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Streak */}
                <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/20 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Chuỗi ngày học</p>
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    {profile.streak}
                                </p>
                                <p className="text-xs text-muted-foreground">ngày liên tiếp</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <Flame className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* XP */}
                <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/20 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Điểm kinh nghiệm</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {profile.xp.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">XP tổng cộng</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Level Badge */}
                <Card className="border-0 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Cấp độ</p>
                                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                    Lv.{currentLevel}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                                        {levelBadgeLabel}
                                    </Badge>
                                </div>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions + XP Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-1 border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold">Hành động nhanh</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full h-12 justify-start text-left bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg shadow-purple-500/20 border-0 rounded-xl group">
                            <FlaskConical className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span className="flex-1">Bắt đầu thí nghiệm mới</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="w-full h-12 justify-start text-left rounded-xl group border-2">
                            <TestTubes className="w-5 h-5 mr-3 flex-shrink-0 text-blue-500" />
                            <span className="flex-1">Vào phòng thực hành ngay</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="w-full h-12 justify-start text-left rounded-xl group border-2">
                            <Microscope className="w-5 h-5 mr-3 flex-shrink-0 text-emerald-500" />
                            <span className="flex-1">Xem bài học mới</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardContent>
                </Card>

                {/* XP Progress Card */}
                <Card className="lg:col-span-2 border shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Tiến độ cấp độ</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Realtime
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex flex-col items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
                                <span className="text-white font-bold text-xl">Lv.</span>
                                <span className="text-white font-extrabold text-2xl leading-none">{currentLevel}</span>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{levelBadgeLabel}</span>
                                    <span className="text-muted-foreground">{xpInLevel} / 500 XP</span>
                                </div>
                                <Progress value={xpPercent} className="h-3" />
                                <p className="text-xs text-muted-foreground">
                                    Cần thêm <strong>{500 - xpInLevel} XP</strong> để lên Lv.{currentLevel + 1}
                                </p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-500">{profile.streak}</p>
                                <p className="text-xs text-muted-foreground mt-1">Ngày streak</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-500">{profile.xp.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">Tổng XP</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-500">{recentExperiments.length}</p>
                                <p className="text-xs text-muted-foreground mt-1">Thí nghiệm</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Experiments */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Thí nghiệm gần đây</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Xem tất cả
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                {recentExperiments.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                                <FlaskConical className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium mb-1">Chưa có thí nghiệm nào</p>
                                <p className="text-sm text-muted-foreground">Hãy bắt đầu thí nghiệm đầu tiên của bạn!</p>
                            </div>
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0">
                                <FlaskConical className="w-4 h-4 mr-2" />
                                Bắt đầu ngay
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentExperiments.map((ue) => {
                            const exp = ue.experiments;
                            if (!exp) return null;
                            const IconComp = iconMap[exp.icon ?? "FlaskConical"] ?? FlaskConical;
                            const gradient = subjectGradient[exp.subject] ?? "from-purple-500 to-blue-500";
                            const bg = subjectBg[exp.subject] ?? "bg-purple-50 dark:bg-purple-950/30";

                            return (
                                <Card key={ue.id} className={`group border-0 ${bg} hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden`}>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComp className="w-5 h-5 text-white" />
                                            </div>
                                            {ue.completed ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-0 text-[10px] hover:bg-emerald-100">
                                                    Hoàn thành ✓
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">{ue.progress}%</Badge>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-sm line-clamp-1">{exp.title}</h3>
                                            <p className="text-xs text-muted-foreground">{exp.subject}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Progress value={ue.progress} className="h-1.5" />
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {timeAgo(ue.last_accessed_at)}
                                            </div>
                                        </div>

                                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs group-hover:bg-background/50">
                                            <Play className="w-3 h-3 mr-1" />
                                            {ue.completed ? "Xem lại" : "Tiếp tục"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
