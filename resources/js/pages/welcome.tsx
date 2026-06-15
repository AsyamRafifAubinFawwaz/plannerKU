import { Head, Link, usePage } from '@inertiajs/react';
import { FaFire } from 'react-icons/fa6';
import { FiCheckCircle, FiCalendar } from 'react-icons/fi';

export default function Welcome() {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-bg text-text selection:bg-primary/30 font-sans">
            <Head title="PlannerKu - Satu tempat untuk semua rencanamu" />

            {/* Navbar */}
            <nav className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <img src="/image/logo-light.svg" alt="PlannerKu" className="h-8 w-auto object-contain" />

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
                        <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
                        <a href="#harga" className="hover:text-primary transition-colors">Harga</a>
                        <a href="#testimoni" className="hover:text-primary transition-colors">Testimoni</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm border-b-4 border-b-[#C4500D] active:translate-y-[2px] active:border-b-[1px] transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-text-muted hover:text-white font-medium text-sm transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm border-b-4 border-b-[#C4500D] active:translate-y-[2px] active:border-b-[1px] transition-all"
                                >
                                    Coba Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-primary text-xs font-medium mb-6">
                        <FaFire /> Gratis selamanya. Upgrade kapan saja.
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
                        Satu tempat untuk <br />
                        <span className="text-primary">semua rencanamu.</span>
                    </h1>
                    <p className="text-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Tugas kuliah, kebiasaan harian, dan kalender semuanya dalam satu app yang simpel, bergaya game, dan anti-membosankan.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={auth?.user ? "/dashboard" : "/register"}
                            className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg border-b-[6px] border-b-[#C4500D] active:translate-y-[4px] active:border-b-[2px] transition-all text-center"
                        >
                            Mulai Gratis Sekarang
                        </Link>
                        <a
                            href="#fitur"
                            className="w-full sm:w-auto bg-surface text-text px-8 py-4 rounded-2xl font-bold text-lg border-b-[6px] border-b-[#0A0A0A] border border-border active:translate-y-[4px] active:border-b-[2px] transition-all text-center hover:bg-card"
                        >
                            Lihat Fitur
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-border mb-32">
                    {[
                        { label: 'Pengguna aktif', value: '1.200+' },
                        { label: 'Tugas selesai', value: '48.000+' },
                        { label: 'Streak diraih', value: '12.000+' },
                        { label: 'Rating app', value: '4.9 ★' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-extrabold text-primary mb-1">{stat.value}</div>
                            <div className="text-text-muted text-sm font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Fitur Utama */}
                <div id="fitur" className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Semua yang kamu butuhkan,<br/><span className="text-text-muted">tidak lebih, tidak kurang.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Task Card */}
                        <div className="bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 bg-card rounded-2xl border border-border flex items-center justify-center text-primary mb-6">
                                <FiCheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Task Planner</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">Tugas kuliah + harian dalam satu list. Label, deadline, dan foto lampiran.</p>
                            <ul className="space-y-3 text-sm text-text-muted font-medium">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Label semantik</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Set deadline & reminder</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Lampiran foto (Pro)</li>
                            </ul>
                        </div>

                        {/* Habit Card */}
                        <div className="bg-surface border border-primary/50 border-b-[6px] border-b-primary/30 rounded-3xl p-8 relative hover:-translate-y-1 transition-transform">
                            <div className="absolute top-6 right-6 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">Gamifikasi</div>
                            <div className="w-12 h-12 bg-card rounded-2xl border border-border flex items-center justify-center text-primary mb-6">
                                <FaFire size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Habit Tracker</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">Bangun kebiasaan dengan streak yang bikin kamu tidak mau berhenti.</p>
                            <ul className="space-y-3 text-sm text-text-muted font-medium">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Desain koin 3D interaktif</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Dot tracker 7 hari</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Streak system</li>
                            </ul>
                        </div>

                        {/* Calendar Card */}
                        <div className="bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 bg-card rounded-2xl border border-border flex items-center justify-center text-primary mb-6">
                                <FiCalendar size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Kalender</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">Semua aktivitas dan event dalam satu tampilan rapi dan minimalis.</p>
                            <ul className="space-y-3 text-sm text-text-muted font-medium">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Tampilan mingguan & bulanan</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Event multi-hari</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Label warna per event</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Harga */}
                <div id="harga" className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Mulai gratis. <span className="text-text-muted">Upgrade kapan saja.</span></h2>
                        <p className="text-text-muted font-medium">Tidak ada kartu kredit. Bayar pas butuh saja.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        {/* Gratis */}
                        <div className="bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-text-muted mb-2">Gratis</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">Rp 0</span>
                                <span className="text-text-muted text-sm font-medium">/selamanya</span>
                            </div>
                            <ul className="space-y-4 text-sm text-text-muted font-medium mb-8">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> 10 tugas/bulan</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> 3 habit aktif</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> 10 event kalender</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Lampiran (1 foto, 2MB)</li>
                                <li className="flex items-center gap-3 opacity-30"><FiCheckCircle /> Notif WA Harian otomatis</li>
                            </ul>
                            <Link href="/register" className="block w-full text-center bg-card text-text border border-border py-3 rounded-xl font-bold hover:bg-border transition-colors">
                                Mulai Gratis
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="bg-surface border-2 border-primary border-b-[8px] border-b-[#C4500D] rounded-3xl p-8 relative transform md:-translate-y-4">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">
                                Paling Populer
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">Rp 19rb</span>
                                <span className="text-text-muted text-sm font-medium">/bulan</span>
                            </div>
                            <ul className="space-y-4 text-sm text-text font-medium mb-8">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Tugas tak terbatas</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Habit tak terbatas</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Event tak terbatas</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Lampiran (3 foto, 5MB/foto)</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-primary"/> Notif WA Harian otomatis</li>
                            </ul>
                            <Link href="/register" className="block w-full text-center bg-primary text-white py-3 rounded-xl font-bold border-b-4 border-b-[#C4500D] active:translate-y-[2px] active:border-b-[2px] transition-all">
                                Upgrade ke Pro
                            </Link>
                        </div>

                        {/* Max */}
                        <div className="bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-text-muted mb-2">Max</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">Rp 39rb</span>
                                <span className="text-text-muted text-sm font-medium">/bulan</span>
                            </div>
                            <ul className="space-y-4 text-sm text-text-muted font-medium mb-8">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Semua fitur Pro</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Multi-akun (Sharing)</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Statistik & Analisa Habit</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Timeline Group / Kelompok</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-success"/> Export tugas ke PDF</li>
                            </ul>
                            <Link href="/register" className="block w-full text-center bg-card text-text border border-border py-3 rounded-xl font-bold hover:bg-border transition-colors">
                                Upgrade ke Max
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Testimoni */}
                <div id="testimoni" className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold mb-4 text-white">Apa kata mereka?</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-surface border border-border rounded-2xl p-6">
                            <div className="text-primary text-4xl font-serif mb-4">"</div>
                            <p className="text-text-muted text-sm italic mb-6">Akhirnya ada planner yang simpel. Streak-nya bikin nagih, ngga sabar nyentang tiap hari!</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1D9E75] flex items-center justify-center text-white font-bold">A</div>
                                <div>
                                    <div className="font-bold text-sm text-white">Anisa S.</div>
                                    <div className="text-xs text-text-faint">Mhs. Teknik UI</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface border border-border rounded-2xl p-6">
                            <div className="text-primary text-4xl font-serif mb-4">"</div>
                            <p className="text-text-muted text-sm italic mb-6">Fitur foto tugas andalan banget. Foto soal dari WA dosen langsung kerekam di jadwal.</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">B</div>
                                <div>
                                    <div className="font-bold text-sm text-white">Bagas R.</div>
                                    <div className="text-xs text-text-faint">Mhs. Manajemen</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface border border-border rounded-2xl p-6">
                            <div className="text-primary text-4xl font-serif mb-4">"</div>
                            <p className="text-text-muted text-sm italic mb-6">Nyobain versi gratis, langsung upgrade Pro. Notif WA pagi hari lumayan nyelamatin nyawa.</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#378ADD] flex items-center justify-center text-white font-bold">S</div>
                                <div>
                                    <div className="font-bold text-sm text-white">Sari E.</div>
                                    <div className="text-xs text-text-faint">Freelancer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center bg-surface border border-border rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Mulai sekarang, gratis.</h2>
                    <p className="text-text-muted text-lg mb-10 font-medium">Tidak perlu kartu kredit • Daftar 10 detik • Cancel kapan saja</p>
                    <Link
                        href="/register"
                        className="inline-block bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl border-b-[6px] border-b-[#C4500D] active:translate-y-[4px] active:border-b-[2px] transition-all shadow-xl shadow-primary/20"
                    >
                        Daftar Gratis Sekarang
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-surface py-12">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <img src="/image/logo-light.svg" alt="PlannerKu" className="h-6 w-auto object-contain" />
                    <div className="text-text-muted text-sm font-medium">
                        © {new Date().getFullYear()} PlannerKu. Dibuat dengan ❤️ di Indonesia.
                    </div>
                </div>
            </footer>
        </div>
    );
}
