import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg p-6 md:p-10 text-text selection:bg-primary/30">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8 bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-8 md:p-10">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl border-b-4 border-[#C4500D]">
                                P
                            </div>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-extrabold text-white">{title}</h1>
                            <p className="text-center text-sm text-text-muted font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
