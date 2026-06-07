import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { PhotoUploader } from './photo-uploader';
import { useEffect } from 'react';

interface Task {
    id: number;
    title: string;
    category: 'kuliah' | 'harian' | 'penting';
    due_date: string | null;
    notes: string | null;
     attachments: string[] | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    task?: Task;
}

export function TaskFormModal({ open, onClose, task }: Props) {
    const isEdit = !!task;
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        return dateStr.split('T')[0];
    };
    const form = useForm({
        title: task?.title ?? '',
        category: (task?.category ?? 'harian') as
            | 'kuliah'
            | 'harian'
            | 'penting',
        due_date: task?.due_date ?? '',
        notes: task?.notes ?? '',
        attachments: [] as File[],
    });

    useEffect(() => {
        if (open) {
            form.setData({
                title: task?.title ?? '',
                category: (task?.category ?? 'harian') as
                    | 'kuliah'
                    | 'harian'
                    | 'penting',
                due_date: formatDate(task?.due_date),
                notes: task?.notes ?? '',
                attachments: [] as File[],
            });
            form.clearErrors();
        }
    }, [open, task]);

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(
                    isEdit
                        ? 'Tugas berhasil diperbarui.'
                        : 'Tugas berhasil ditambahkan.',
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
            form.post(`/tasks/${task.id}`, options);
        } else {
            form.post('/tasks', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Tugas' : 'Tambah Tugas'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="task-title">Judul</Label>
                        <Input
                            id="task-title"
                            placeholder="Judul tugas..."
                            value={form.data.title}
                            onChange={(e) =>
                                form.setData('title', e.target.value)
                            }
                        />
                        {form.errors.title && (
                            <p className="text-xs text-destructive">
                                {form.errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Kategori</Label>
                        <Select
                            value={form.data.category}
                            onValueChange={(val) =>
                                form.setData(
                                    'category',
                                    val as 'kuliah' | 'harian' | 'penting',
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="harian">Harian</SelectItem>
                                <SelectItem value="kuliah">Kuliah</SelectItem>
                                <SelectItem value="penting">Penting</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Deadline */}
                    <div className="space-y-1.5">
                        <Label htmlFor="task-due-date">
                            Deadline (opsional)
                        </Label>
                        <Input
                            id="task-due-date"
                            type="date"
                            value={form.data.due_date ?? ''}
                            onChange={(e) =>
                                form.setData('due_date', e.target.value)
                            }
                        />
                    </div>

                    {/* Catatan */}
                    <div className="space-y-1.5">
                        <Label htmlFor="task-notes">Catatan (opsional)</Label>
                        <Input
                            id="task-notes"
                            placeholder="Catatan tambahan..."
                            value={form.data.notes ?? ''}
                            onChange={(e) =>
                                form.setData('notes', e.target.value)
                            }
                        />
                    </div>
                    {/* Foto */}
                    <div className="space-y-1.5">
                        {isEdit &&
                            task?.attachments &&
                            task.attachments.length > 0 && (
                                <div className="mb-2 space-y-1.5">
                                    <Label>Foto Saat Ini</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {task.attachments.map((path, idx) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-square overflow-hidden rounded-md border"
                                            >
                                                <img
                                                    src={`/storage/${path}`}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Upload foto baru di bawah ini akan
                                        menggantikan foto lama.
                                    </p>
                                </div>
                            )}

                        <PhotoUploader
                            files={form.data.attachments}
                            onChange={(files) =>
                                form.setData('attachments', files)
                            }
                            maxFiles={1}
                        />
                        {form.errors.attachments && (
                            <p className="text-xs text-destructive">
                                {form.errors.attachments}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            className="cursor-pointer"
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button
                            className="cursor-pointer"
                            type="submit"
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
