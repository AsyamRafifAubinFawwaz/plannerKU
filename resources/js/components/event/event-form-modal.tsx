import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Event {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    color: string | null;
    notes: string | null;
    is_done: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
    event?: Event;
}

export function EventFormModal({ open, onClose, event }: Props) {
    const isEdit = !!event;

    const form = useForm({
        title: event?.title ?? '',
        start_date: event?.start_date?.split('T')[0] ?? '',
        end_date: event?.end_date?.split('T')[0] ?? '',
        color: event?.color ?? '#FF6B1A',
        notes: event?.notes ?? '',
    });

    useEffect(() => {
        if (open) {
            form.setData({
                title: event?.title ?? '',
                start_date: event?.start_date?.split('T')[0] ?? '',
                end_date: event?.end_date?.split('T')[0] ?? '',
                color: event?.color ?? '#FF6B1A',
                notes: event?.notes ?? '',
            });
            form.clearErrors();
        }
    }, [open, event]);

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(
                    isEdit ? 'Event berhasil diperbarui.' : 'Event berhasil ditambahkan.',
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
            form.post(`/events/${event.id}`, options);
        } else {
            form.post('/events', options);
        }
    }

    function toggleDone() {
        if (!event) return;
        router.patch(`/events/${event.id}/toggle-done`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Event' : 'Tambah Event'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    {/* Judul */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-title">Judul</Label>
                        <Input
                            id="event-title"
                            placeholder="Judul event..."
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                        />
                        {form.errors.title && (
                            <p className="text-xs text-destructive">{form.errors.title}</p>
                        )}
                    </div>

                    {/* Tanggal Mulai & Selesai */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="event-start">Tanggal Mulai</Label>
                            <Input
                                id="event-start"
                                type="date"
                                value={form.data.start_date}
                                onChange={(e) => form.setData('start_date', e.target.value)}
                            />
                            {form.errors.start_date && (
                                <p className="text-xs text-destructive">{form.errors.start_date}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="event-end">Tanggal Selesai</Label>
                            <Input
                                id="event-end"
                                type="date"
                                value={form.data.end_date}
                                onChange={(e) => form.setData('end_date', e.target.value)}
                            />
                            {form.errors.end_date && (
                                <p className="text-xs text-destructive">{form.errors.end_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Warna */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-color">Warna Label</Label>
                        <div className="flex items-center gap-3">
                            <input
                                id="event-color"
                                type="color"
                                value={form.data.color}
                                onChange={(e) => form.setData('color', e.target.value)}
                                className="h-9 w-14 cursor-pointer rounded-lg border border-border bg-card p-1"
                            />
                            <span className="text-sm text-muted-foreground">
                                {form.data.color}
                            </span>
                        </div>
                    </div>

                    {/* Catatan */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-notes">Catatan (opsional)</Label>
                        <textarea
                            id="event-notes"
                            placeholder="Catatan tambahan..."
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div>
                            {isEdit && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={toggleDone}
                                    className={`cursor-pointer ${event?.is_done ? 'text-muted-foreground' : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
                                >
                                    {event?.is_done ? 'Batal Selesai' : 'Tandai Selesai'}
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
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
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
