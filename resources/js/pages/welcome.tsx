import { Head, Link, usePage } from '@inertiajs/react';
import { FaFire } from 'react-icons/fa6';
import {
    FiCheckCircle,
    FiCalendar,
    FiSun,
    FiMoon,
    FiInstagram,
    FiTwitter,
    FiGithub,
} from 'react-icons/fi';
import { useAppearance } from '@/hooks/use-appearance';

export default function Welcome() {
    const { auth, stats } = usePage().props as any;
    const { appearance, updateAppearance } = useAppearance();
    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className="bg-bg text-text min-h-screen font-sans selection:bg-primary/30">
            <Head title="PlannerKu - Satu tempat untuk semua rencanamu" />

            <nav className="bg-surface/50 sticky top-0 z-50 border-b border-border backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <img
                        src="/image/logo-gelap.svg"
                        alt="PlannerKu"
                        className="hidden dark:block w-auto"
                    />
                    <img
                        src="/image/logo-terang.svg"
                        alt="PlannerKu"
                        className="block dark:hidden w-auto"
                    />

                    <div className="text-text-muted hidden items-center gap-8 text-sm font-medium md:flex">
                        <a
                            href="#fitur"
                            className="transition-colors hover:text-primary"
                        >
                            Fitur
                        </a>
                        <a
                            href="#harga"
                            className="transition-colors hover:text-primary"
                        >
                            Harga
                        </a>
                        <a
                            href="#testimoni"
                            className="transition-colors hover:text-primary"
                        >
                            Testimoni
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() =>
                                updateAppearance(isDark ? 'light' : 'dark')
                            }
                            className="text-text-muted cursor-pointer bg-surface rounded-full border border-border p-2 transition-colors hover:text-foreground"
                        >
                            {isDark ? (
                                <FiMoon size={18} />
                            ) : (
                                <FiSun size={18} />
                            )}
                        </button>
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-xl border-b-4 border-b-[#C4500D] bg-primary px-5 py-2 text-sm font-bold text-white transition-all active:translate-y-[2px] active:border-b-[1px]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="bg-surface text-text-muted rounded-xl border border-border px-5 py-2 text-sm font-medium hover:bg-primary hover:text-white transition-colors active:translate-y-[2px] active:border-b-[1px]"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-xl border-b-4 border-b-[#C4500D] bg-primary px-5 py-2 text-sm font-bold text-white transition-all active:translate-y-[2px] active:border-b-[1px]"
                                >
                                    Coba Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-6 pt-24 pb-32">
                <div className="mx-auto mb-20 max-w-3xl text-center">
                
                    <h1 className="mb-6 text-5xl leading-tight font-extrabold text-foreground md:text-6xl">
                        Satu tempat untuk <br />
                        <span className="text-primary">semua rencanamu.</span>
                    </h1>
                    <p className="text-text-muted mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl">
                        Tugas kuliah, kebiasaan harian, dan kalender semuanya
                        dalam satu app yang simpel, bergaya game, dan
                        anti-membosankan.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={auth?.user ? '/dashboard' : '/register'}
                            className="w-full rounded-2xl border-b-[6px] border-b-[#C4500D] bg-primary px-8 py-4 text-center text-lg font-bold text-white transition-all active:translate-y-[4px] active:border-b-[2px] sm:w-auto"
                        >
                            Mulai Gratis Sekarang
                        </Link>
                        <a
                            href="#fitur"
                            className="bg-surface text-text w-full rounded-2xl border border-b-[6px] border-border px-8 py-4 text-center text-lg font-bold transition-all hover:bg-card active:translate-y-[4px] active:border-b-[2px] sm:w-auto"
                        >
                            Lihat Fitur
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-32 grid grid-cols-2 gap-6 border-y border-border py-12 md:grid-cols-4">
                    {[
                        { label: 'Pengguna aktif', value: (stats?.users ?? 0).toLocaleString('id-ID') },
                        { label: 'Tugas selesai', value: (stats?.tasks ?? 0).toLocaleString('id-ID') },
                        { label: 'Streak diraih', value: (stats?.streaks ?? 0).toLocaleString('id-ID') },
                        { label: 'Rating app', value: `${stats?.rating ?? '4.9'} ★` },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="mb-1 text-3xl font-extrabold text-primary">
                                {stat.value}
                            </div>
                            <div className="text-text-muted text-sm font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fitur Utama */}
                <div id="fitur" className="mb-32">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
                            Semua yang kamu butuhkan,
                            <br />
                            <span className="text-text-muted">
                                tidak lebih, tidak kurang.
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Task Card */}
                        <div className="bg-surface rounded-3xl border border-b-[6px] border-border p-8 transition-transform hover:-translate-y-1">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-primary">
                                <FiCheckCircle size={24} />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-foreground">
                                Task Planner
                            </h3>
                            <p className="text-text-muted mb-6 text-sm leading-relaxed">
                                Tugas kuliah + harian dalam satu list. Label,
                                deadline, dan foto lampiran.
                            </p>
                            <ul className="text-text-muted space-y-3 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Label semantik
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Set deadline & reminder
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Lampiran foto (Pro)
                                </li>
                            </ul>
                        </div>

                        {/* Habit Card */}
                        <div className="bg-surface relative rounded-3xl border border-b-[6px] border-primary/50 border-b-primary/30 p-8 transition-transform hover:-translate-y-1">
                            <div className="absolute top-6 right-6 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                                Gamifikasi
                            </div>
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-primary">
                                <FaFire size={24} />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-foreground">
                                Habit Tracker
                            </h3>
                            <p className="text-text-muted mb-6 text-sm leading-relaxed">
                                Bangun kebiasaan dengan streak yang bikin kamu
                                tidak mau berhenti.
                            </p>
                            <ul className="text-text-muted space-y-3 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Desain koin 3D interaktif
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Dot tracker 7 hari
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Streak system
                                </li>
                            </ul>
                        </div>

                        {/* Calendar Card */}
                        <div className="bg-surface rounded-3xl border border-b-[6px] border-border p-8 transition-transform hover:-translate-y-1">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-primary">
                                <FiCalendar size={24} />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-foreground">
                                Kalender
                            </h3>
                            <p className="text-text-muted mb-6 text-sm leading-relaxed">
                                Semua aktivitas dan event dalam satu tampilan
                                rapi dan minimalis.
                            </p>
                            <ul className="text-text-muted space-y-3 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Tampilan mingguan & bulanan
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Event multi-hari
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Label warna per event
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Harga */}
                <div id="harga" className="mb-32">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
                            Mulai gratis.{' '}
                            <span className="text-text-muted">
                                Upgrade kapan saja.
                            </span>
                        </h2>
                        <p className="text-text-muted font-medium">
                            Tidak ada kartu kredit. Bayar pas butuh saja.
                        </p>
                    </div>

                    <div className="grid items-center gap-6 md:grid-cols-3">
                        {/* Gratis */}
                        <div className="bg-surface rounded-3xl border border-b-[6px] border-border p-8">
                            <h3 className="text-text-muted mb-2 text-xl font-bold">
                                Gratis
                            </h3>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-foreground">
                                    Rp 0
                                </span>
                                <span className="text-text-muted text-sm font-medium">
                                    /selamanya
                                </span>
                            </div>
                            <ul className="text-text-muted mb-8 space-y-4 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    10 tugas/bulan
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" /> 3
                                    habit aktif
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    10 event kalender
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    Lampiran (1 foto, 2MB)
                                </li>
                                <li className="flex items-center gap-3 opacity-30">
                                    <FiCheckCircle /> Notif WA Harian otomatis
                                </li>
                            </ul>
                            <Link
                                href="/register"
                                className="text-text block w-full rounded-xl border border-border bg-card py-3 text-center font-bold transition-colors hover:bg-border"
                            >
                                Mulai Gratis
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="bg-surface relative transform rounded-3xl border-2 border-b-[8px] border-primary border-b-[#C4500D] p-8 md:-translate-y-4">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white">
                                Paling Populer
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-primary">
                                Pro
                            </h3>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-foreground">
                                    Rp 19rb
                                </span>
                                <span className="text-text-muted text-sm font-medium">
                                    /bulan
                                </span>
                            </div>
                            <ul className="text-text mb-8 space-y-4 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Tugas tak terbatas
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Habit tak terbatas
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Event tak terbatas
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Lampiran (3 foto, 5MB/foto)
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-primary" />{' '}
                                    Notif WA Harian otomatis
                                </li>
                            </ul>
                            <Link
                                href="/register"
                                className="block w-full rounded-xl border-b-4 border-b-[#C4500D] bg-primary py-3 text-center font-bold text-white transition-all active:translate-y-[2px] active:border-b-[2px]"
                            >
                                Upgrade ke Pro
                            </Link>
                        </div>

                        {/* Max */}
                        <div className="bg-surface rounded-3xl border border-b-[6px] border-border p-8">
                            <h3 className="text-text-muted mb-2 text-xl font-bold">
                                Max
                            </h3>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-foreground">
                                    Rp 39rb
                                </span>
                                <span className="text-text-muted text-sm font-medium">
                                    /bulan
                                </span>
                            </div>
                            <ul className="text-text-muted mb-8 space-y-4 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    Semua fitur Pro
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    Multi-akun (Sharing)
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    Statistik & Analisa Habit
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    Timeline Group / Kelompok
                                </li>
                                <li className="flex items-center gap-3">
                                    <FiCheckCircle className="text-success" />{' '}
                                    Export tugas ke PDF
                                </li>
                            </ul>
                            <Link
                                href="/register"
                                className="text-text block w-full rounded-xl border border-border bg-card py-3 text-center font-bold transition-colors hover:bg-border"
                            >
                                Upgrade ke Max
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Testimoni */}
                <div id="testimoni" className="mb-32">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-extrabold text-foreground">
                            Apa kata mereka?
                        </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-surface rounded-2xl border border-border p-6">
                            <div className="mb-4 font-serif text-4xl text-primary">
                                "
                            </div>
                            <p className="text-text-muted mb-6 text-sm italic">
                                Akhirnya ada planner yang simpel. Streak-nya
                                bikin nagih, ngga sabar nyentang tiap hari!
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75] font-bold text-white">
                                    A
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground">
                                        Anisa S.
                                    </div>
                                    <div className="text-text-faint text-xs">
                                        Mhs. Teknik UI
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface rounded-2xl border border-border p-6">
                            <div className="mb-4 font-serif text-4xl text-primary">
                                "
                            </div>
                            <p className="text-text-muted mb-6 text-sm italic">
                                Fitur foto tugas andalan banget. Foto soal dari
                                WA dosen langsung kerekam di jadwal.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                                    B
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground">
                                        Bagas R.
                                    </div>
                                    <div className="text-text-faint text-xs">
                                        Mhs. Manajemen
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface rounded-2xl border border-border p-6">
                            <div className="mb-4 font-serif text-4xl text-primary">
                                "
                            </div>
                            <p className="text-text-muted mb-6 text-sm italic">
                                Nyobain versi gratis, langsung upgrade Pro.
                                Notif WA pagi hari lumayan nyelamatin nyawa.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#378ADD] font-bold text-white">
                                    S
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground">
                                        Sari E.
                                    </div>
                                    <div className="text-text-faint text-xs">
                                        Freelancer
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-surface relative overflow-hidden rounded-[2.5rem] border border-border p-12 text-center md:p-20">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    <h2 className="mb-6 text-4xl font-extrabold text-foreground md:text-5xl">
                        Mulai sekarang, gratis.
                    </h2>
                    <p className="text-text-muted mb-10 text-lg font-medium">
                        Tidak perlu kartu kredit • Daftar 10 detik • Cancel
                        kapan saja
                    </p>
                    <Link
                        href="/register"
                        className="inline-block rounded-2xl border-b-[6px] border-b-[#C4500D] bg-primary px-10 py-5 text-xl font-bold text-white shadow-xl shadow-primary/20 transition-all active:translate-y-[4px] active:border-b-[2px]"
                    >
                        Daftar Gratis Sekarang
                    </Link>
                </div>
            </main>

            <footer className="bg-surface border-t border-border py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
                        <div className="flex flex-col items-center gap-5 md:items-start">
                            <div className="relative">
                                <img
                                    src="/image/logo-terang.svg"
                                    alt="PlannerKu"
                                    className="block h-6 w-auto object-contain dark:hidden"
                                />
                                <img
                                    src="/image/logo-gelap.svg"
                                    alt="PlannerKu"
                                    className="hidden h-6 w-auto object-contain dark:block"
                                />
                            </div>
                            <div className="text-text-muted flex items-center gap-4">
                                <a
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    <FiInstagram size={20} />
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    <FiTwitter size={20} />
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    <FiGithub size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Kanan: Support By */}
                        <div className="flex flex-col items-center gap-3 md:items-end">
                            <p className="text-text-muted text-sm font-medium">
                                Support by :
                            </p>
                            <img
                                src="/image/Secondary Logo.png"
                                alt="Supported By"
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Bawah: Copyright Center */}
                    <div className="border-t border-border pt-8 text-center">
                        <div className="text-text-muted text-sm font-medium">
                            © {new Date().getFullYear()} PlannerKu by motrack.{' '}
                            <br className="md:hidden" />
                            Dibuat dengan bangga di Indonesia.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
