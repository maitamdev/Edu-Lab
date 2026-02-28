import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left panel - decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
                <div className="absolute top-1/4 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="relative flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
                        <FlaskConical className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-center">EduLab</h1>
                    <p className="text-2xl font-semibold mb-2 text-center text-white/90">
                        Thí Nghiệm Ảo – Học Thật!
                    </p>
                    <p className="text-purple-100 text-center max-w-sm leading-relaxed">
                        Phòng thí nghiệm & thực hành ảo cho học sinh THPT và sinh viên Việt Nam
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            500+ Thí nghiệm
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            AI Tutor thông minh
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            Gamification
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 rounded-full bg-pink-400" />
                            Hoàn toàn miễn phí
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                            <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold gradient-text">EduLab</span>
                    </Link>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </div>
    );
}
