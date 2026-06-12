import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { TaskDetailSheet } from '@/components/task/task-detail-sheet';
import { TaskFormModal } from '@/components/task/task-form-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { Head, router, usePage } from '@inertiajs/react';
import { FiCamera, FiEye, FiEdit2, FiTrash2, FiFileText, FiPlus } from 'react-icons/fi';
import { Checkbox } from '@/components/ui/checkbox';
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
    const [upgradeModalType, setUpgradeModalType] = useState<'task' | 'pdf' | null>(null);
    
    const { auth } = usePage().props as any;
    const canAddTask = auth?.limits?.canAddTask ?? true;

    function openCreate() {
        if (!canAddTask) {
            setUpgradeModalType('task');
            return;
        }
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

    const handleExportPdf = () => {
        if (!auth?.user?.isMax) {
            setUpgradeModalType('pdf');
            return;
        }
        window.location.href = '/tasks/export';
    };

    const filteredTasks = tasks.filter(t => {
        if (activeFilter === 'Semua') return true;
        return t.category.toLowerCase() === activeFilter.toLowerCase();
    });

    return (
        <>
            <Head title="Tugas" />

            <div className="p-8 w-full max-w-5xl mx-auto">
                {/* Header Utama */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium text-foreground">Tugas</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="cursor-pointer rounded-lg border-2" onClick={handleExportPdf}>
                            <FiFileText className="mr-2 h-4 w-4" /> Unduh PDF
                        </Button>
                        <Button className="bg-[#FF6B1A] hover:bg-[#FF8C42] text-white cursor-pointer rounded-lg" onClick={openCreate}>
                            <FiPlus className="mr-2 h-4 w-4" /> Tambah tugas
                        </Button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 mb-8">
                    {FILTERS.map((filter) => (
                        <Button
                            key={filter}
                            variant="ghost"
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-full px-4 py-1.5 h-auto text-sm font-medium transition-colors cursor-pointer ${
                                activeFilter === filter 
                                    ? 'bg-[#FF6B1A] text-white hover:bg-[#FF8C42] hover:text-white' 
                                    : 'bg-[#1A1A1A] text-muted-foreground hover:bg-[#2A2A2A] hover:text-foreground'
                            }`}
                        >
                            {filter}
                        </Button>
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
                                    className={`group flex items-center justify-between rounded-2xl bg-[#141414] border-2 px-5 py-4 transition-all active:translate-y-[2px] active:border-b-2 ${
                                        task.is_done 
                                            ? 'border-[#FF6B1A]/30 border-b-[#FF6B1A]/20 bg-[#FF6B1A]/5 opacity-80' 
                                            : 'border-[#2A2A2A] border-b-4 hover:border-[#444]'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <Checkbox 
                                            checked={task.is_done}
                                            onCheckedChange={() => toggleDone(task)}
                                            className={`w-6 h-6 rounded-full border-2 transition-colors flex-shrink-0 ${
                                                task.is_done 
                                                    ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white data-[state=checked]:bg-[#FF6B1A] data-[state=checked]:border-[#FF6B1A]' 
                                                    : 'border-muted-foreground/40 hover:border-[#FF6B1A]'
                                            }`}
                                        />

                                        {/* Judul Tugas */}
                                        <p
                                            className={`text-[15px] truncate font-bold ${
                                                task.is_done ? 'text-muted-foreground line-through' : 'text-foreground'
                                            }`}
                                        >
                                            {task.title}
                                        </p>
                                    </div>

                                    {/* Kolom Kanan (Badge, Photo, Actions) */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        {/* Badge Kategori */}
                                        <span
                                            className="rounded-full px-3 py-1.5 text-[11px] font-bold"
                                            style={{
                                                background: badge.bg,
                                                color: badge.text,
                                            }}
                                        >
                                            {badge.label.toUpperCase()}
                                        </span>

                                        {hasPhoto && (
                                            <div className="flex h-8 w-10 items-center justify-center rounded-lg border-2 border-[#2A2A2A] bg-[#1E1E1E]">
                                                <FiCamera className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Actions (Sekarang selalu muncul!) */}
                                        <div className="flex items-center gap-1.5 border-l-2 border-[#2A2A2A] pl-4 ml-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2A2A2A] rounded-lg transition-transform hover:scale-110 active:scale-95"
                                                onClick={() => setTaskDetail(task)}
                                                title="Detail"
                                            >
                                                <FiEye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2A2A2A] rounded-lg transition-transform hover:scale-110 active:scale-95"
                                                onClick={() => openEdit(task)}
                                                title="Edit"
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-transform hover:scale-110 active:scale-95"
                                                onClick={() => setTaskToDelete(task)}
                                                title="Hapus"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </Button>
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
            <UpgradeModal
                open={upgradeModalType === 'task'}
                onClose={() => setUpgradeModalType(null)}
                title="Limit Tugas Tercapai"
                description={`Kamu telah mencapai batas maksimal ${auth?.limits?.tasks?.max ?? 10} tugas bulan ini.`}
            />
            <UpgradeModal
                open={upgradeModalType === 'pdf'}
                onClose={() => setUpgradeModalType(null)}
                title="Fitur Khusus Max"
                description="Fitur Export ke PDF hanya tersedia untuk pengguna paket Max. Upgrade sekarang untuk mencetak jadwalmu!"
            />
        </>
    );
}
