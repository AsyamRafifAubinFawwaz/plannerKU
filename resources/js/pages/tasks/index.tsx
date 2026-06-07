import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { TaskDetailSheet } from '@/components/task/task-detail-sheet';
import { TaskFormModal } from '@/components/task/task-form-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Task {
    id: number;
    title: string;
    category: 'kuliah' | 'harian' | 'penting';
    due_date: string | null;
    is_done: boolean;
    done_at: string | null;
    notes: string | null;
    attachments: string[] | null;
}

interface Props {
    tasks: Task[];
}

const categoryBadge: Record<
    string,
    { bg: string; text: string; label: string }
> = {
    kuliah: { bg: '#1E1A3A', text: '#A89BE8', label: 'Kuliah' },
    harian: { bg: '#1E1E1E', text: '#888888', label: 'Harian' },
    penting: { bg: '#FF6B1A1A', text: '#FF6B1A', label: 'Penting' },
};

export default function TasksIndex({ tasks }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [taskDetail, setTaskDetail] = useState<Task | null>(null);

    function openCreate() {
        setTaskToEdit(null);
        setFormOpen(true);
    }

    function openEdit(task: Task) {
        setTaskToEdit(task);
        setFormOpen(true);
    }

    function toggleDone(task: Task) {
        router.patch(
            `/tasks/${task.id}`,
            { is_done: !task.is_done },
            { preserveScroll: true },
        );
    }

    function confirmDelete() {
        if (!taskToDelete) return;
        setDeleting(true);
        router.delete(`/tasks/${taskToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tugas berhasil dihapus.');
                setTaskToDelete(null);
            },
            onError: () => {
                toast.error('Gagal menghapus tugas.');
            },
            onFinish: () => setDeleting(false),
        });
    }

    const pendingTasks = tasks.filter((t) => !t.is_done);
    const doneTasks = tasks.filter((t) => t.is_done);

    return (
        <>
            <Head title="Tugas" />

            <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-medium text-foreground">
                            Tugas
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {pendingTasks.length} aktif · {doneTasks.length}{' '}
                            selesai
                        </p>
                    </div>
                    <Button onClick={openCreate}>+ Tambah Tugas</Button>
                </div>

                <div className="space-y-2">
                    {tasks.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">
                            Belum ada tugas. Tambahkan tugas pertamamu!
                        </p>
                    ) : (
                        tasks.map((task) => {
                            const badge = categoryBadge[task.category];
                            return (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-accent"
                                >
                                    <Checkbox
                                        checked={task.is_done}
                                        onCheckedChange={() => toggleDone(task)}
                                        className="flex-shrink-0"
                                    />

                                    <div
                                        className="min-w-0 flex-1 cursor-pointer"
                                    >
                                        <p
                                            className={`text-sm ${task.is_done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                                        >
                                            {task.title}
                                        </p>
                                        {task.due_date && (
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {task.due_date}
                                            </p>
                                        )}
                                    </div>

                                    <span
                                        className="flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                                        style={{
                                            background: badge.bg,
                                            color: badge.text,
                                        }}
                                    >
                                        {badge.label}
                                    </span>

                                    <div className="flex flex-shrink-0 gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setTaskDetail(task)}
                                            className="cursor-pointer"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(task)}
                                            className="cursor-pointer"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer text-destructive hover:text-destructive"
                                            onClick={() =>
                                                setTaskToDelete(task)
                                            }
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <TaskFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                task={taskToEdit ?? undefined}
            />

            <ConfirmDialog
                open={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={confirmDelete}
                title="Hapus tugas ini?"
                description={`"${taskToDelete?.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
                loading={deleting}
            />
            <TaskDetailSheet
                open={!!taskDetail}
                task={taskDetail}
                onClose={() => setTaskDetail(null)}
            />
        </>
    );
}
