import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { HabitFormModal } from '@/components/habit/habit-form-modal';
import { HabitRow } from '@/components/habit/habit-row';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Habit {
    id: number;
    name: string;
    icon: string | null;
    target_per_week: number;
    current_streak: number;
    is_active: boolean;
    logs: { logged_date: string }[];
}

interface Props {
    habits: Habit[];
}

const DAYS_HEADER = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export default function HabitIndex({ habits }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setHabitToEdit(null);
        setFormOpen(true);
    }

    function openEdit(habit: Habit) {
        setHabitToEdit(habit);
        setFormOpen(true);
    }

    function confirmDelete() {
        if (!habitToDelete) return;
        setDeleting(true);
        router.delete(`/habits/${habitToDelete.id}`, {
            onSuccess: () => {
                toast.success('Habit berhasil dihapus!');
                setHabitToDelete(null);
            },
            onError: () => toast.error('Gagal menghapus habit.'),
            onFinish: () => setDeleting(false),
        });
    }

    return (
        <>
            <Head title="Habit Tracker" />

            <div className="p-8 w-full max-w-4xl mx-auto">
                {/* Header Utama */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-medium text-foreground">Habit Tracker</h1>
                    <Button className="bg-[#FF6B1A] hover:bg-[#FF8C42] text-white cursor-pointer rounded-lg" onClick={openCreate}>
                        + Tambah habit
                    </Button>
                </div>

                {/* Header Hari (Sen, Sel, Rab...) */}
                {habits.length > 0 && (
                    <div className="flex justify-end mb-2 pr-[96px]">
                        <div className="flex gap-1.5">
                            {DAYS_HEADER.map((d, i) => (
                                <div key={i} className="w-8 text-center text-[11px] text-muted-foreground">
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* List Habits */}
                <div className="space-y-2.5">
                    {habits.length === 0 ? (
                        <p className="py-12 text-center text-muted-foreground bg-[#1A1A1A] rounded-xl">
                            Belum ada habit. Yuk tambahkan kebiasaan pertamamu!
                        </p>
                    ) : (
                        habits.map((habit) => (
                            <HabitRow
                                key={habit.id}
                                habit={habit}
                                onEdit={openEdit}
                                onDelete={setHabitToDelete}
                            />
                        ))
                    )}
                </div>

                {/* Upgrade Banner */}
                {habits.length >= 3 && (
                    <div className="mt-8 rounded-xl border border-[#FF6B1A] bg-[#FF6B1A]/5 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl opacity-80">🔒</span>
                            <div>
                                <h3 className="font-medium text-[#FF6B1A]">Kamu sudah di batas maksimal (3 habit)</h3>
                                <p className="text-sm text-muted-foreground">Upgrade ke Pro untuk habit tak terbatas + notif WhatsApp</p>
                            </div>
                        </div>
                        <Button className="bg-[#FF6B1A] hover:bg-[#FF8C42] text-white cursor-pointer transition-colors">
                            Upgrade Pro
                        </Button>
                    </div>
                )}

                {/* Statistik */}
                {habits.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-[15px] font-medium text-muted-foreground mb-4">Statistik minggu ini</h3>
                        <div className="space-y-2.5">
                            {habits.map((habit) => {
                                // Hitung progress 7 hari terakhir secara kasar (dummy logic for display)
                                const doneCount = habit.logs.filter(log => {
                                    const d = new Date(log.logged_date);
                                    const today = new Date();
                                    const diff = (today.getTime() - d.getTime()) / (1000 * 3600 * 24);
                                    return diff <= 7;
                                }).length;
                                const percent = Math.round((doneCount / 7) * 100);

                                return (
                                    <div key={habit.id} className="flex items-center justify-between rounded-xl bg-[#1A1A1A] px-4 py-4">
                                        <span className="text-[14px] text-foreground font-medium">
                                            {habit.name} {habit.icon && <span>{habit.icon}</span>}
                                        </span>
                                        <div className="flex items-center gap-4 w-1/3">
                                            <div className="h-1.5 flex-1 rounded-full bg-[#2A2A2A] overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${percent}%`, backgroundColor: '#FF6B1A' }} 
                                                />
                                            </div>
                                            <span className="text-[13px] text-muted-foreground w-8 text-right">
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah / Edit */}
            <HabitFormModal
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setHabitToEdit(null);
                }}
                habit={habitToEdit ?? undefined}
            />

            {/* Dialog Konfirmasi Hapus */}
            <ConfirmDialog
                open={!!habitToDelete}
                onClose={() => setHabitToDelete(null)}
                onConfirm={confirmDelete}
                title="Hapus habit ini?"
                description={`"${habitToDelete?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
                loading={deleting}
            />
        </>
    );
}
