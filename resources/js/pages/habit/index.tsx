import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { HabitFormModal } from '@/components/habit/habit-form-modal';
import { HabitRow } from '@/components/habit/habit-row';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { FiPlus, FiX, FiCamera, FiZap } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa6';
import { FaCheckCircle } from "react-icons/fa";
import { FaCameraRetro } from "react-icons/fa";
interface HabitLog {
    id: number;
    logged_date: string;
    photo_path: string | null;
    caption: string | null;
}

interface Habit {
    id: number;
    name: string;
    icon: string | null;
    target_per_week: number;
    current_streak: number;
    is_active: boolean;
    logs: HabitLog[];
}

interface ProofPhoto {
    id: number;
    habit_id: number;
    logged_date: string;
    photo_path: string;
    caption: string | null;
    habit?: { id: number; name: string };
}

interface Props {
    habits: Habit[];
    points: number;
    proofPhotos: ProofPhoto[];
}

const DAYS_HEADER = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        days.push(`${year}-${month}-${day}`);
    }
    return days;
}

export default function HabitIndex({ habits, points, proofPhotos }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    // Modal upload bukti foto
    const [proofHabit, setProofHabit] = useState<Habit | null>(null);
    const [proofCaption, setProofCaption] = useState('');
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [uploadingProof, setUploadingProof] = useState(false);
    // Lightbox foto
    const [lightboxPhoto, setLightboxPhoto] = useState<ProofPhoto | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props as any;
    const canAddHabit = auth?.limits?.canAddHabit ?? true;

    const last7Days = getLast7Days();
    const todayStr = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();

    // Optimistic state: habit IDs yang sudah dicentang hari ini
    const [todayDoneIds, setTodayDoneIds] = useState<Set<number>>(() => {
        return new Set(
            habits
                .filter(h => h.logs.some(l => (typeof l.logged_date === 'string' ? l.logged_date : '').split('T')[0] === todayStr))
                .map(h => h.id)
        );
    });

    // Sync saat Inertia refresh data
    useEffect(() => {
        setTodayDoneIds(new Set(
            habits
                .filter(h => h.logs.some(l => (typeof l.logged_date === 'string' ? l.logged_date : '').split('T')[0] === todayStr))
                .map(h => h.id)
        ));
    }, [habits]);

    function handleHabitToggle(habitId: number, date: string) {
        const isCurrentlyDone = date === todayStr && todayDoneIds.has(habitId);
        // Optimistic update — tombol langsung muncul/hilang
        if (date === todayStr) {
            setTodayDoneIds(prev => {
                const next = new Set(prev);
                if (isCurrentlyDone) next.delete(habitId);
                else next.add(habitId);
                return next;
            });
        }
        router.post(`/habits/${habitId}/toggle`, { date }, { preserveScroll: true });
    }

    function openCreate() {
        if (!canAddHabit) { setUpgradeModalOpen(true); return; }
        setHabitToEdit(null);
        setFormOpen(true);
    }

    function openEdit(habit: Habit) { setHabitToEdit(habit); setFormOpen(true); }

    function confirmDelete() {
        if (!habitToDelete) return;
        setDeleting(true);
        router.delete(`/habits/${habitToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => { toast.success('Habit berhasil dihapus.'); setHabitToDelete(null); },
            onError: () => toast.error('Gagal menghapus habit.'),
            onFinish: () => setDeleting(false),
        });
    }

    function openProofModal(habit: Habit) {
        setProofHabit(habit);
        setProofCaption('');
        setProofPreview(null);
        setProofFile(null);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setProofFile(file);
        setProofPreview(URL.createObjectURL(file));
    }

    function submitProof(e: React.FormEvent) {
        e.preventDefault();
        if (!proofHabit || !proofFile) return;
        setUploadingProof(true);
        const formData = new FormData();
        formData.append('photo', proofFile);
        formData.append('caption', proofCaption);

        router.post(`/habits/${proofHabit.id}/proof`, formData as any, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Bukti berhasil disimpan! 📸');
                setProofHabit(null);
            },
            onError: (errors) => toast.error(Object.values(errors)[0] as string),
            onFinish: () => setUploadingProof(false),
        });
    }

    return (
        <>
            <Head title="Habit" />

            <div className="p-8 w-full max-w-4xl mx-auto">

                {/* ── Header + Poin Badge ── */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FaFire className="text-primary" /> Habit Tracker
                        </h1>
                        <p className="text-text-muted text-sm mt-0.5">Bangun kebiasaan baik, satu hari dalam satu waktu.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Badge Poin */}
                        <div className="flex items-center gap-2 bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 rounded-xl px-4 py-2">
                            <FiZap className="text-primary" size={18} />
                            <div>
                                <p className="text-[11px] text-text-muted font-medium">Total Poin</p>
                                <p className="text-lg font-black text-primary leading-none">{points.toLocaleString()}</p>
                            </div>
                        </div>
                        <Button className="bg-primary border-b-4 border-b-[#C4500D] hover:bg-[#FF8C42] text-white rounded-lg transition-all active:translate-y-[2px] active:border-b-[1px]" onClick={openCreate}>
                            <FiPlus className="mr-2 h-4 w-4" /> Tambah Habit
                        </Button>
                    </div>
                </div>

                {/* ── Header 7 Hari ── */}
                <div className="grid grid-cols-[1fr_auto] gap-4 mb-3">
                    <div />
                    <div className="grid grid-cols-7 gap-2 w-56 flex-shrink-0">
                        {last7Days.map((dateStr, i) => {
                            const d = new Date(dateStr + 'T00:00:00');
                            const isToday = dateStr === todayStr;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-text-muted font-medium">{DAYS_HEADER[d.getDay() === 0 ? 6 : d.getDay() - 1]}</span>
                                    <span className={`text-[11px] font-bold ${isToday ? 'text-primary' : 'text-text-faint'}`}>{d.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── List Habit ── */}
                {habits.length === 0 ? (
                    <div className="py-16 text-center bg-surface border border-border rounded-2xl">
                        <FaFire className="mx-auto text-text-muted mb-4" size={32} />
                        <p className="text-text-muted text-sm">Belum ada habit. Mulai bangun kebiasaan baikmu!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {habits.map(habit => {
                            // Gunakan optimistic state agar tombol muncul langsung tanpa tunggu Inertia
                            const doneToday = todayDoneIds.has(habit.id);
                            const hasProof  = habit.logs.some(l =>
                                (typeof l.logged_date === 'string' ? l.logged_date : '').split('T')[0] === todayStr
                                && !!l.photo_path
                            );

                            return (
                                <div key={habit.id} className={`bg-surface border border-border border-b-4 rounded-xl px-4 py-3 transition-all duration-150 ${
                                    doneToday ? 'border-success/40 border-b-success/20' : 'border-border border-b-[#0A0A0A]'
                                }`}>
                                    <HabitRow
                                        habit={habit}
                                        last7Days={last7Days}
                                        onEdit={openEdit}
                                        onDelete={setHabitToDelete}
                                        onToggle={handleHabitToggle}
                                    />
                                    {/* Tombol bukti foto — muncul segera setelah dicentang */}
                                    {doneToday && (
                                        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
                                            <span className="text-[11px] text-success font-medium flex items-center gap-2.5"><FaCheckCircle  className='mb-1 text-green-500' size={20}/> Selesai hari ini</span>
                                            {!hasProof ? (
                                                <button
                                                    onClick={() => openProofModal(habit)}
                                                    className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-primary transition-colors bg-card border border-border rounded-lg px-2 py-1"
                                                >
                                                    <FiCamera size={11} /> Tambah bukti foto
                                                </button>
                                            ) : (
                                                <span className="text-[11px] text-primary flex items-center gap-1">
                                                    <FiCamera size={11} /> Bukti sudah ada ✓
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Galeri Memori Foto Bukti ── */}
                {proofPhotos.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <FaCameraRetro className="text-primary" size={20}/> Jejak Keberhasilanmu
                        </h2>
                        <p className="text-text-muted text-sm mb-5">Rekap foto bukti semua habit yang sudah kamu lakukan.</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {proofPhotos.map(photo => (
                                <button
                                    key={photo.id}
                                    onClick={() => setLightboxPhoto(photo)}
                                    className="group relative aspect-square rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors"
                                >
                                    <img
                                        src={`/storage/${photo.photo_path}`}
                                        alt={photo.caption ?? 'Bukti habit'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                                        <p className="text-[10px] text-white font-medium px-2 pb-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                            {photo.habit?.name}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modal Upload Bukti Foto ── */}
            {proofHabit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">📸 Tambah Bukti Kegiatan</h3>
                            <button onClick={() => setProofHabit(null)} className="text-text-muted hover:text-white p-1 rounded-full">
                                <FiX size={20} />
                            </button>
                        </div>
                        <p className="text-text-muted text-sm mb-4">
                            Habit: <span className="text-primary font-semibold">{proofHabit.name}</span>
                        </p>
                        <form onSubmit={submitProof} className="space-y-4">
                            {/* Upload foto */}
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center h-40 overflow-hidden"
                            >
                                {proofPreview ? (
                                    <img src={proofPreview} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="text-center text-text-muted p-4">
                                        <FiCamera size={28} className="mx-auto mb-2" />
                                        <p className="text-sm">Klik untuk pilih foto</p>
                                        <p className="text-[11px]">JPG, PNG, WEBP • Maks 5MB</p>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>
                            {/* Caption */}
                            <input
                                type="text"
                                value={proofCaption}
                                onChange={e => setProofCaption(e.target.value)}
                                placeholder="Tulis caption singkat... (opsional)"
                                className="w-full bg-card border border-border text-white text-sm px-3 py-2 rounded-lg focus:border-primary focus:outline-none"
                            />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setProofHabit(null)}
                                    className="flex-1 bg-card border border-border text-text-muted py-2 rounded-lg text-sm font-semibold hover:text-white transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={!proofFile || uploadingProof}
                                    className="flex-1 bg-primary border-b-4 border-b-[#C4500D] text-white py-2 rounded-lg text-sm font-bold transition-all active:translate-y-[2px] active:border-b disabled:opacity-50">
                                    {uploadingProof ? 'Menyimpan...' : 'Simpan Bukti'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Lightbox Foto ── */}
            {lightboxPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={() => setLightboxPhoto(null)}>
                    <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                        <FiX size={24} />
                    </button>
                    <div className="max-w-2xl max-h-[90vh] p-4 flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                        <img src={`/storage/${lightboxPhoto.photo_path}`} className="rounded-xl max-h-[75vh] object-contain" alt={lightboxPhoto.caption ?? ''} />
                        <div className="text-center">
                            <p className="text-white font-semibold">{lightboxPhoto.habit?.name}</p>
                            {lightboxPhoto.caption && <p className="text-text-muted text-sm mt-1">{lightboxPhoto.caption}</p>}
                            <p className="text-text-faint text-xs mt-1">{new Date(lightboxPhoto.logged_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            )}

            <HabitFormModal open={formOpen} onClose={() => setFormOpen(false)} habit={habitToEdit ?? undefined} />
            <ConfirmDialog
                open={!!habitToDelete} onClose={() => setHabitToDelete(null)} onConfirm={confirmDelete}
                title="Hapus habit ini?"
                description={`"${habitToDelete?.name}" akan dihapus permanen.`}
                loading={deleting}
            />
            <UpgradeModal
                open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)}
                title="Limit Habit Tercapai"
                description="Paket Gratis hanya mendukung 3 habit aktif. Upgrade ke Pro untuk habit tak terbatas!"
            />
        </>
    );
}
