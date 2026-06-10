import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { TaskDetailSheet } from '@/components/task/task-detail-sheet';
import { TaskFormModal } from '@/components/task/task-form-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Camera, Check, Eye, Pencil, Trash2Icon } from 'lucide-react';
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

const categoryBadge: Record<string, { bg: string; text: string; label: string }> = {
    kuliah: { bg: '#1E1A3A', text: '#A89BE8', label: 'kuliah' },
    harian: { bg: '#1E1E1E', text: '#888888', label: 'harian' },
    penting: { bg: '#FF6B1A1A', text: '#FF6B1A', label: 'penting' },
};

const FILTERS = ['Semua', 'Kuliah', 'Harian', 'Penting'];

export default function TasksIndex({ tasks }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [taskDetail, setTaskDetail] = useState<Task | null>(null);
    const [activeFilter, setActiveFilter] = useState('Semua');

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
            onError: () => toast.error('Gagal menghapus tugas.'),
            onFinish: () => setDeleting(false),
        });
    }

    const filteredTasks = tasks.filter(t => {
        if (activeFilter === 'Semua') return true;
        return t.category.toLowerCase() === activeFilter.toLowerCase();
    });

    return (
        <>
            <Head title="Tugas" />

            <div className="p-8 max-w-5xl mx-auto">
                {/* Header Utama */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium text-foreground">Tugas</h1>
                    <Button className="bg-[#FF6B1A] hover:bg-[#FF8C42] text-white cursor-pointer rounded-lg" onClick={openCreate}>
                        + Tambah tugas
                    </Button>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 mb-8">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                                activeFilter === filter 
                                    ? 'bg-[#FF6B1A] text-white' 
                                    : 'bg-[#1A1A1A] text-muted-foreground hover:bg-[#2A2A2A] hover:text-foreground'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Task List */}
                <div className="space-y-2.5">
                    {filteredTasks.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground bg-[#1A1A1A] rounded-xl">
                            Belum ada tugas di kategori ini.
                        </p>
                    ) : (
                        filteredTasks.map((task) => {
                            const badge = categoryBadge[task.category];
                            const hasPhoto = task.attachments && task.attachments.length > 0;

                            return (
                                <div
                                    key={task.id}
                                    className="group flex items-center justify-between rounded-xl bg-[#1A1A1A] px-4 py-3.5 transition-colors hover:bg-[#222]"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Custom Checkbox */}
                                        <button 
                                            onClick={() => toggleDone(task)}
                                            className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-[4px] border cursor-pointer transition-colors ${
                                                task.is_done 
                                                    ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white' 
                                                    : 'border-muted-foreground/30 bg-transparent hover:border-[#FF6B1A]'
                                            }`}
                                        >
                                            {task.is_done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                        </button>

                                        {/* Judul Tugas */}
                                        <p
                                            className={`text-[14px] truncate ${
                                                task.is_done ? 'text-muted-foreground line-through' : 'text-foreground font-medium'
                                            }`}
                                        >
                                            {task.title}
                                        </p>
                                    </div>

                                    {/* Kolom Kanan (Badge, Photo, Actions) */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span
                                            className="rounded-full px-3 py-1 text-[11px] font-medium"
                                            style={{
                                                background: badge.bg,
                                                color: badge.text,
                                            }}
                                        >
                                            {badge.label}
                                        </span>

                                        {hasPhoto && (
                                            <div className="flex h-7 w-9 items-center justify-center rounded-md border border-border bg-[#1E1E1E]">
                                                <Camera className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Actions (visible on hover) */}
                                        <div className="hidden group-hover:flex items-center gap-1 ml-2">
                                            <button
                                                className="p-1 cursor-pointer text-muted-foreground hover:text-foreground"
                                                onClick={() => setTaskDetail(task)}
                                                title="Detail"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 cursor-pointer text-muted-foreground hover:text-foreground"
                                                onClick={() => openEdit(task)}
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 cursor-pointer text-muted-foreground hover:text-destructive"
                                                onClick={() => setTaskToDelete(task)}
                                                title="Hapus"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </button>
                                        </div>
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
