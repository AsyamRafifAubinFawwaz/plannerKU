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

            <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-medium">Habit Tracker</h1>
                        <p className="text-sm text-muted-foreground">
                            {habits.filter((h) => h.is_active).length} habit aktif
                        </p>
                    </div>
                    <Button className="cursor-pointer" onClick={openCreate}>
                        + Tambah Habit
                    </Button>
                </div>

                {/* List Habits */}
                <div className="space-y-2">
                    {habits.length === 0 ? (
                        <p className="py-12 text-center text-muted-foreground">
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
