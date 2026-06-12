import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { FiCheckCircle } from 'react-icons/fi';

export default function SubscriptionIndex() {
    const { auth } = usePage().props as any;
    const isPro = auth?.user?.isPro ?? false;
    const isMax = auth?.user?.isMax ?? false;

    return (
        <>
            <Head title="Upgrade Paket" />

            <div className="p-8 w-full max-w-4xl mx-auto mt-4 relative">
                {/* Tombol Kembali karena tidak pakai AppLayout */}
                <Link href="/dashboard" className="absolute top-8 left-8 text-text-muted hover:text-white flex items-center gap-2 font-medium transition-colors">
                    &larr; Kembali
                </Link>

                <div className="text-center mb-16 mt-8 md:mt-0">
                    <h1 className="text-3xl font-extrabold text-white mb-3">Pilih Paket Produktivitasmu</h1>
                    <p className="text-text-muted font-medium">Maksimalkan potensimu dengan fitur tanpa batas.</p>
                </div>

                {/* Container max-w-3xl agar 2 card pas bersandingan */}
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
                    {/* Pro */}
                    <div className="bg-surface border-2 border-primary border-b-[8px] border-b-[#C4500D] rounded-3xl p-8 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">
                            Paling Populer
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-white">Rp 19.000</span>
                            <span className="text-text-muted text-sm font-medium">/bulan</span>
                        </div>
                        <ul className="space-y-4 text-sm text-text font-medium mb-8">
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Tugas tak terbatas</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Habit tak terbatas</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Event tak terbatas</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Lampiran (3 foto, 5MB/foto)</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Notif WA Harian otomatis</li>
                        </ul>

                        {isPro && !isMax ? (
                            <button disabled className="block w-full text-center bg-card text-text-muted py-3 rounded-xl font-bold border border-border cursor-not-allowed">
                                Paket Kamu Saat Ini
                            </button>
                        ) : isMax ? (
                            <button disabled className="block w-full text-center bg-card text-text-muted py-3 rounded-xl font-bold border border-border cursor-not-allowed">
                                Termasuk di Max
                            </button>
                        ) : (
                            <Link href="/pricing/confirm?plan=pro" className="block w-full text-center bg-primary text-white py-3 rounded-xl font-bold border-b-4 border-b-[#C4500D] active:translate-y-[2px] active:border-b-[2px] transition-all">
                                Pilih Pro
                            </Link>
                        )}
                    </div>

                    {/* Max */}
                    <div className="bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-text mb-2">Max</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-white">Rp 39.000</span>
                            <span className="text-text-muted text-sm font-medium">/bulan</span>
                        </div>
                        <ul className="space-y-4 text-sm text-text-muted font-medium mb-8">
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Semua fitur Pro</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Multi-akun (Sharing)</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Statistik & Analisa Habit</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Timeline Group / Kelompok</li>
                            <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Export tugas ke PDF</li>
                        </ul>

                        {isMax ? (
                            <button disabled className="block w-full text-center bg-card text-text-muted py-3 rounded-xl font-bold border border-border cursor-not-allowed">
                                Paket Kamu Saat Ini
                            </button>
                        ) : (
                            <Link href="/pricing/confirm?plan=max" className="block w-full text-center bg-card text-text border border-border py-3 rounded-xl font-bold hover:bg-border transition-colors">
                                Pilih Max
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
