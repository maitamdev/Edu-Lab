"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Flame,
    Zap,
    Award,
    FlaskConical,
    Microscope,
    Atom,
    Beaker,
    Dna,
    ArrowRight,
    TrendingUp,
    Clock,
    Star,
    Play,
    TestTubes,
} from "lucide-react";

interface UserData {
    name: string;
    email: string;
    role: string;
}

const recentExperiments = [
    {
        title: "Chuyển động ném xiên",
        subject: "Vật Lý",
        icon: Atom,
        progress: 85,
        gradient: "from-violet-500 to-purple-600",
        bg: "bg-violet-50 dark:bg-violet-950/30",
        lastAccess: "2 giờ trước",
    },
    {
        title: "Phản ứng oxi hóa khử",
        subject: "Hóa Học",
        icon: Beaker,
        progress: 60,
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        lastAccess: "5 giờ trước",
    },
    {
        title: "Quan sát tế bào thực vật",
        subject: "Sinh Học",
        icon: Dna,
        progress: 100,
        gradient: "from-emerald-500 to-green-600",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        lastAccess: "Hôm qua",
    },
    {
        title: "Cân bằng phương trình hóa học",
        subject: "Hóa Học",
        icon: FlaskConical,
        progress: 40,
        gradient: "from-orange-500 to-red-500",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        lastAccess: "2 ngày trước",
    },
];

const weeklyProgress = [
    { day: "T2", value: 75 },
    { day: "T3", value: 90 },
    { day: "T4", value: 60 },
    { day: "T5", value: 85 },
    { day: "T6", value: 95 },
    { day: "T7", value: 45 },
    { day: "CN", value: 70 },
];

export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userData = localStorage.getItem("edulab_user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    if (!mounted || !user) return null;

    const firstName = user.name.split(" ").pop() || user.name;

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
                                <p className="text-sm font-medium text-muted-foreground">
                                    Chuỗi ngày học
                                </p>
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    12
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
                                <p className="text-sm font-medium text-muted-foreground">
                                    Điểm kinh nghiệm
                                </p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    2,450
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
                                <p className="text-sm font-medium text-muted-foreground">
                                    Cấp độ
                                </p>
                                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                    Lv.8
                                </p>
                                <div className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                                        Nhà khoa học trẻ
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

            {/* Quick Actions + Progress */}
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
                        <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-left rounded-xl group border-2"
                        >
                            <TestTubes className="w-5 h-5 mr-3 flex-shrink-0 text-blue-500" />
                            <span className="flex-1">Vào phòng thực hành ngay</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-left rounded-xl group border-2"
                        >
                            <Microscope className="w-5 h-5 mr-3 flex-shrink-0 text-emerald-500" />
                            <span className="flex-1">Xem bài học mới</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Weekly Progress */}
                <Card className="lg:col-span-2 border shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Tiến độ tuần này</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +15% so với tuần trước
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Bar chart */}
                            <div className="flex items-end justify-between gap-2 h-40">
                                {weeklyProgress.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full relative rounded-t-lg overflow-hidden bg-muted" style={{ height: "120px" }}>
                                            <div
                                                className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-purple-600 to-blue-500 transition-all duration-700 ease-out"
                                                style={{
                                                    height: `${day.value}%`,
                                                    animationDelay: `${i * 100}ms`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {day.day}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Overall progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Tiến độ tổng thể</span>
                                    <span className="font-semibold">74%</span>
                                </div>
                                <Progress value={74} className="h-2" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentExperiments.map((exp, i) => (
                        <Card
                            key={i}
                            className={`group border-0 ${exp.bg} hover:shadow-lg transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden`}
                        >
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div
                                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <exp.icon className="w-5 h-5 text-white" />
                                    </div>
                                    {exp.progress === 100 ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] hover:bg-emerald-100">
                                            Hoàn thành ✓
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-[10px]">
                                            {exp.progress}%
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm line-clamp-1">
                                        {exp.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{exp.subject}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <Progress value={exp.progress} className="h-1.5" />
                                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {exp.lastAccess}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full h-8 text-xs group-hover:bg-background/50"
                                >
                                    <Play className="w-3 h-3 mr-1" />
                                    {exp.progress === 100 ? "Xem lại" : "Tiếp tục"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
