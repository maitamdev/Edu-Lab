"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FlaskConical,
  Microscope,
  Bot,
  Users,
  LayoutDashboard,
  Trophy,
  Atom,
  Beaker,
  Dna,
  Code2,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Zap,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

/* ============================================
   HEADER COMPONENT
============================================ */
function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">EduLab</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <a href="#features" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
            Tính năng
          </a>
          <a href="#subjects" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
            Môn học
          </a>
          <a href="#testimonials" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
            Cảm nhận
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25 border-0">
              Đăng ký miễn phí
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ============================================
   HERO SECTION
============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950/30 dark:via-background dark:to-blue-950/20" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-300/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />

      {/* Floating icons */}
      <div className="absolute top-32 left-[10%] animate-bounce delay-300 hidden lg:block">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center border border-purple-200/30 dark:border-purple-700/30">
          <Atom className="w-6 h-6 text-purple-500" />
        </div>
      </div>
      <div className="absolute top-48 right-[12%] animate-bounce delay-700 hidden lg:block">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm flex items-center justify-center border border-blue-200/30 dark:border-blue-700/30">
          <Beaker className="w-6 h-6 text-blue-500" />
        </div>
      </div>
      <div className="absolute bottom-40 left-[15%] animate-bounce delay-500 hidden lg:block">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm flex items-center justify-center border border-green-200/30 dark:border-green-700/30">
          <Dna className="w-5 h-5 text-green-500" />
        </div>
      </div>
      <div className="absolute bottom-32 right-[18%] animate-bounce delay-1000 hidden lg:block">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm flex items-center justify-center border border-orange-200/30 dark:border-orange-700/30">
          <Code2 className="w-5 h-5 text-orange-500" />
        </div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 text-center space-y-8">
        <Badge className="px-4 py-1.5 text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Nền tảng giáo dục #1 Việt Nam
        </Badge>

        {/* Logo icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-transform">
            <FlaskConical className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="gradient-text">EduLab</span>
          </h1>
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Thí Nghiệm Ảo – Học Thật!
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Phòng thí nghiệm & thực hành ảo cho học sinh THPT và sinh viên Việt Nam.
            Trải nghiệm khoa học tương tác, mọi lúc mọi nơi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-xl shadow-purple-500/25 border-0 rounded-xl group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Bắt đầu miễn phí
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg rounded-xl border-2 group"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Xem thí nghiệm demo
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">10,000+ Học sinh</span>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">500+ Thí nghiệm</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">4.9/5 Đánh giá</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FEATURES SECTION
============================================ */
const features = [
  {
    icon: FlaskConical,
    title: "Phòng Thí Nghiệm Ảo",
    description: "Mô phỏng thí nghiệm Vật Lý, Hóa Học, Sinh Học với đồ họa 3D tương tác chân thực.",
    gradient: "from-purple-500 to-purple-600",
    shadowColor: "shadow-purple-500/20",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Microscope,
    title: "Phòng Thực Hành",
    description: "Không gian luyện tập với bài tập thực hành, bảng công cụ và hướng dẫn từng bước.",
    gradient: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/20",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Bot,
    title: "AI Tutor",
    description: "Trợ lý AI thông minh giải đáp thắc mắc, gợi ý bài học và đánh giá kết quả học tập.",
    gradient: "from-emerald-500 to-emerald-600",
    shadowColor: "shadow-emerald-500/20",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Users,
    title: "Hợp tác thời gian thực",
    description: "Cùng bạn bè thực hiện thí nghiệm nhóm, thảo luận và chia sẻ kết quả trực tuyến.",
    gradient: "from-orange-500 to-orange-600",
    shadowColor: "shadow-orange-500/20",
    bgLight: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: LayoutDashboard,
    title: "Bảng điều khiển Giáo viên",
    description: "Quản lý lớp học, giao bài, theo dõi tiến độ và đánh giá học sinh một cách dễ dàng.",
    gradient: "from-rose-500 to-rose-600",
    shadowColor: "shadow-rose-500/20",
    bgLight: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Hệ thống điểm XP, huy hiệu, bảng xếp hạng giúp học tập trở nên thú vị hơn.",
    gradient: "from-amber-500 to-amber-600",
    shadowColor: "shadow-amber-500/20",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-1.5 text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100">
            Tại sao chọn EduLab?
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Tất cả những gì bạn cần để{" "}
            <span className="gradient-text">học khoa học</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nền tảng tích hợp đầy đủ công cụ giúp việc học trở nên sinh động và hiệu quả hơn bao giờ hết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border-0 ${feature.bgLight} hover:shadow-xl ${feature.shadowColor} transition-all duration-500 hover:-translate-y-1`}
            >
              <CardContent className="p-8">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SUBJECTS CAROUSEL SECTION
============================================ */
const subjects = [
  {
    icon: Atom,
    name: "Vật Lý",
    description: "Cơ học, Điện từ, Quang học, Nhiệt động lực học",
    experiments: 156,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: Beaker,
    name: "Hóa Học",
    description: "Hóa vô cơ, Hóa hữu cơ, Hóa phân tích",
    experiments: 203,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Dna,
    name: "Sinh Học",
    description: "Tế bào, Di truyền, Sinh thái, Vi sinh vật",
    experiments: 134,
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Code2,
    name: "Lập trình",
    description: "Python, JavaScript, Thuật toán, Cấu trúc dữ liệu",
    experiments: 245,
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
];

function SubjectsSection() {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % subjects.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + subjects.length) % subjects.length);

  return (
    <section id="subjects" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100">
            Đa dạng môn học
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Khám phá các{" "}
            <span className="gradient-text">môn học</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hàng trăm bài thí nghiệm và bài thực hành bao phủ chương trình THPT và đại học.
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <Card
              key={index}
              className={`group overflow-hidden border-0 ${subject.bg} hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer`}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <subject.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {subject.description}
                </p>
                <Badge variant="secondary" className="font-medium">
                  {subject.experiments} thí nghiệm
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <Card
            className={`overflow-hidden border-0 ${subjects[active].bg} shadow-lg`}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subjects[active].gradient} flex items-center justify-center mx-auto shadow-lg`}
              >
                {(() => {
                  const Icon = subjects[active].icon;
                  return <Icon className="w-8 h-8 text-white" />;
                })()}
              </div>
              <h3 className="text-xl font-bold">{subjects[active].name}</h3>
              <p className="text-sm text-muted-foreground">
                {subjects[active].description}
              </p>
              <Badge variant="secondary" className="font-medium">
                {subjects[active].experiments} thí nghiệm
              </Badge>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {subjects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active
                      ? "w-6 bg-primary"
                      : "bg-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={next}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TESTIMONIALS SECTION
============================================ */
const testimonials = [
  {
    name: "Nguyễn Minh Anh",
    role: "Học sinh lớp 11, THPT Nguyễn Du",
    content:
      "Nhờ EduLab mà em hiểu bài Hóa học nhanh hơn rất nhiều! Thí nghiệm trực quan giúp em ghi nhớ kiến thức dễ dàng hơn nhiều so với đọc sách.",
    avatar: "MA",
    color: "bg-purple-500",
  },
  {
    name: "Thầy Trần Văn Hùng",
    role: "Giáo viên Vật Lý, THPT Hà Nội",
    content:
      "EduLab giúp tôi quản lý bài thí nghiệm cho cả lớp một cách hiệu quả. Học sinh hào hứng hơn và kết quả kiểm tra cải thiện rõ rệt.",
    avatar: "TH",
    color: "bg-blue-500",
  },
  {
    name: "Phạm Thị Lan",
    role: "Sinh viên năm 2, ĐH Bách Khoa",
    content:
      "Tính năng AI Tutor thật sự hữu ích. Mỗi khi em gặp bài khó, AI giải thích rất dễ hiểu và gợi ý thêm tài liệu tham khảo.",
    avatar: "PL",
    color: "bg-emerald-500",
  },
  {
    name: "Lê Hoàng Nam",
    role: "Học sinh lớp 12, THPT Lê Quý Đôn",
    content:
      "Hệ thống gamification khiến em muốn học mỗi ngày. Bảng xếp hạng và huy hiệu tạo động lực rất lớn, em duy trì streak 45 ngày rồi!",
    avatar: "LN",
    color: "bg-amber-500",
  },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-1.5 text-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
            Cảm nhận thực tế
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Học sinh & giáo viên{" "}
            <span className="gradient-text">nói gì?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <Card
              key={index}
              className="group border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      className={`${t.color} text-white text-sm font-medium`}
                    >
                      {t.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   CTA SECTION
============================================ */
function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />

      <div className="relative container mx-auto px-4 sm:px-6 text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Sẵn sàng bắt đầu hành trình
          <br />
          khám phá khoa học?
        </h2>
        <p className="text-purple-100 text-lg max-w-xl mx-auto">
          Tham gia cùng hơn 10,000 học sinh và giáo viên đang sử dụng EduLab mỗi ngày.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-white text-purple-700 hover:bg-purple-50 shadow-xl rounded-xl font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              Đăng ký miễn phí ngay
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
============================================ */
function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">EduLab</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nền tảng thí nghiệm và thực hành ảo hàng đầu dành cho học sinh & sinh viên Việt Nam.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Phòng thí nghiệm</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Phòng thực hành</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">AI Tutor</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Bảng xếp hạng</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Góp ý</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cộng đồng</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Pháp lý</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookie</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 EduLab. Bản quyền thuộc về EduLab.
          </p>
          <p className="text-sm text-muted-foreground">
            Thí Nghiệm Ảo – Học Thật! 🧪
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   MAIN PAGE
============================================ */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
