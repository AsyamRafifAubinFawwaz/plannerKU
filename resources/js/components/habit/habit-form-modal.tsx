import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Habit {
    id: number;
    name: string;
    icon: string | null;
    target_per_week: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    habit?: Habit;
}

export function HabitFormModal({ open, onClose, habit }: Props) {
    const isEdit = !!habit;

    const form = useForm({
        name: habit?.name ?? '',
        icon: habit?.icon ?? '',
        target_per_week: habit?.target_per_week ?? 7,
    });

    // Reset form setiap kali modal dibuka
    useEffect(() => {
        if (open) {
            form.setData({
                name: habit?.name ?? '',
                icon: habit?.icon ?? '',
                target_per_week: habit?.target_per_week ?? 7,
            });
            form.clearErrors();
        }
    }, [open, habit]);

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(
                    isEdit ? 'Habit berhasil diperbarui.' : 'Habit berhasil ditambahkan.',
                );
                form.reset();
                onClose();
            },
            onError: () => {
                toast.error('Terjadi kesalahan, coba lagi.');
            },
        };

        if (isEdit) {
            form.transform((data) => ({ ...data, _method: 'patch' }));
            form.post(`/habits/${habit.id}`, options);
        } else {
            form.post('/habits', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Habit' : 'Tambah Habit'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    {/* Nama Habit */}
                    <div className="space-y-1.5">
                        <Label htmlFor="habit-name">Nama Habit</Label>
                        <Input
                            id="habit-name"
                            placeholder="Contoh: Olahraga pagi..."
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && (
                            <p className="text-xs text-destructive">{form.errors.name}</p>
                        )}
                    </div>

                    {/* Icon Emoji */}
                    <div className="space-y-1.5">
                        <Label htmlFor="habit-icon">Icon (emoji, opsional)</Label>
                        <Input
                            id="habit-icon"
                            placeholder="Contoh: 🏃 atau 📚"
                            value={form.data.icon}
                            onChange={(e) => form.setData('icon', e.target.value)}
                        />
                        {form.errors.icon && (
                            <p className="text-xs text-destructive">{form.errors.icon}</p>
                        )}
                    </div>

                    {/* Target per minggu */}
                    <div className="space-y-1.5">
                        <Label htmlFor="habit-target">Target per Minggu (1–7 hari)</Label>
                        <Input
                            id="habit-target"
                            type="number"
                            min={1}
                            max={7}
                            value={form.data.target_per_week}
                            onChange={(e) =>
                                form.setData('target_per_week', Number(e.target.value))
                            }
                        />
                        {form.errors.target_per_week && (
                            <p className="text-xs text-destructive">{form.errors.target_per_week}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
