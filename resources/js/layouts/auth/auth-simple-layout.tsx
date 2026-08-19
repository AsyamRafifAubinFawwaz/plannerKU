import { Link } from '@inertiajs/react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4 text-foreground selection:bg-primary/30 sm:p-8">
            <div className="w-full max-w-md sm:max-w-[900px]">
                <div className="flex flex-col overflow-hidden rounded-3xl border border-b-[6px] border-border border-b-border/80 bg-card shadow-2xl sm:grid sm:grid-cols-2">
                    <div className="relative z-10 flex flex-col justify-center gap-8 p-6 sm:p-12">
                        <div className="flex flex-col items-center gap-4 sm:items-start">
                            <Link
                                href="/"
                                className="flex items-center gap-3 font-medium transition-transform hover:opacity-80"
                            >
                                <img
                                    src="/image/logo-terang.svg"
                                    alt="logo"
                                    className="block dark:hidden w-auto"
                                />
                                <img
                                    src="/image/logo-gelap.svg"
                                    alt="logo"
                                    className="hidden dark:block w-auto"
                                />
                            </Link>

                            <div className="mt-2 w-full space-y-2 text-center sm:text-left">
                                <h1 className="text-2xl font-extrabold text-card-foreground">
                                    {title}
                                </h1>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>

                    <div className="relative hidden flex-col items-center justify-center bg-primary p-8 sm:flex">
                        <div className="z-10 mt-4 mb-8 text-center">
                            <h2 className="mb-3 text-2xl font-extrabold text-white drop-shadow-sm md:text-3xl">
                                Selamat Datang di <br /> PlannerKu
                            </h2>
                            <p className="px-2 text-xs font-medium text-white/90 md:text-sm">
                                Tugas kuliah, kebiasaan harian, dan kalender
                                dalam satu app.
                            </p>
                        </div>

                        <div className="relative z-10 mb-4 flex w-full max-w-[280px] flex-1 items-center justify-center">
                            <img
                                src="/image/robot.png"
                                alt="PlannerKu 3D Illustration"
                                className="h-auto w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:-translate-y-3"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
