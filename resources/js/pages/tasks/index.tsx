import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { TaskDetailSheet } from '@/components/task/task-detail-sheet';
import { TaskFormModal } from '@/components/task/task-form-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { Head, router, usePage } from '@inertiajs/react';
import { FiCamera, FiEye, FiEdit2, FiTrash2, FiFileText, FiPlus, FiChevronDown, FiCheck, FiMenu } from 'react-icons/fi';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
    id: number;
    title: string;
    category: 'kuliah' | 'harian' | 'penting';
    due_date: string | null;
    is_done: boolean;
    done_at: string | null;
    notes: string | null;
    attachments: string[] | null;
    sort_order: number;
}

interface Props {
    tasks: Task[];
}

const categoryBadge: Record<string, { bg: string; text: string; label: string }> = {
    kuliah:  { bg: '#1E1A3A', text: '#A89BE8', label: 'kuliah' },
    harian:  { bg: '#1E1E1E', text: '#888888', label: 'harian' },
    penting: { bg: '#FF6B1A1A', text: '#FF6B1A', label: 'penting' },
};

const CATEGORY_FILTERS = ['Semua', 'Kuliah', 'Harian', 'Penting'];

const SORT_OPTIONS = [
    { key: 'manual',        label: 'Urutan Manual' },
    { key: 'deadline_asc',  label: 'Deadline Terdekat' },
    { key: 'deadline_desc', label: 'Deadline Terjauh' },
    { key: 'newest',        label: 'Terbaru' },
    { key: 'az',            label: 'A – Z' },
];

function applySortKey(tasks: Task[], sortKey: string): Task[] {
    if (sortKey === 'manual') return tasks; // sudah dari server
    return [...tasks].sort((a, b) => {
        switch (sortKey) {
            case 'deadline_asc':
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
            case 'deadline_desc':
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
            case 'newest':
                return b.id - a.id;
            case 'az':
                return a.title.localeCompare(b.title, 'id');
            default:
                return 0;
        }
    });
}

// Kirim urutan baru ke server (silent, no Inertia reload)
async function persistOrder(ids: number[]) {
    const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
    await fetch('/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify({ ids }),
    });
}

export default function TasksIndex({ tasks: initialTasks }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [taskDetail, setTaskDetail] = useState<Task | null>(null);

    // Tab: 'all' | 'todo' | 'done'
    const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'done'>('all');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [sortKey, setSortKey] = useState('manual');
    const [sortOpen, setSortOpen] = useState(false);
    const [upgradeModalType, setUpgradeModalType] = useState<'task' | 'pdf' | null>(null);

    // Optimistic local state untuk tasks & done IDs
    const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);
    const [localDoneIds, setLocalDoneIds] = useState<Set<number>>(
        () => new Set(initialTasks.filter(t => t.is_done).map(t => t.id))
    );

    const sortRef = useRef<HTMLDivElement>(null);
    const { auth } = usePage().props as any;
    const canAddTask = auth?.limits?.canAddTask ?? true;

    // Sync dari Inertia (tapi jaga urutan lokal kalau sort=manual)
    useEffect(() => {
        setLocalDoneIds(new Set(initialTasks.filter(t => t.is_done).map(t => t.id)));
        if (sortKey === 'manual') {
            setLocalTasks(initialTasks);
        } else {
            setLocalTasks(initialTasks);
        }
    }, [initialTasks]);

    // Tutup dropdown sort
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    function openCreate() {
        if (!canAddTask) { setUpgradeModalType('task'); return; }
        setTaskToEdit(null);
        setFormOpen(true);
    }

    function openEdit(task: Task) { setTaskToEdit(task); setFormOpen(true); }

    // Optimistic toggle — langsung pindah tab
    function toggleDone(task: Task) {
        const nowDone = !localDoneIds.has(task.id);
        setLocalDoneIds(prev => {
            const next = new Set(prev);
            if (nowDone) next.add(task.id);
            else next.delete(task.id);
            return next;
        });
        router.patch(`/tasks/${task.id}`, { is_done: nowDone }, { preserveScroll: true });
    }

    function confirmDelete() {
        if (!taskToDelete) return;
        setDeleting(true);
        router.delete(`/tasks/${taskToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => { toast.success('Tugas berhasil dihapus.'); setTaskToDelete(null); },
            onError: () => toast.error('Gagal menghapus tugas.'),
            onFinish: () => setDeleting(false),
        });
    }

    function onDragEnd(result: DropResult) {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const movedTask = displayList[result.source.index];
        const targetTask = displayList[result.destination.index];

        const newList = Array.from(localTasks);
        const sourceIdx = newList.findIndex(t => t.id === movedTask.id);
        if (sourceIdx > -1) newList.splice(sourceIdx, 1);
        
        const targetIdx = newList.findIndex(t => t.id === targetTask.id);
        const insertIdx = result.destination.index > result.source.index ? targetIdx + 1 : targetIdx;
        
        newList.splice(insertIdx, 0, movedTask);

        setLocalTasks(newList);
        setSortKey('manual'); // reset ke manual setelah drag

        const newDisplayList = Array.from(displayList);
        newDisplayList.splice(result.source.index, 1);
        newDisplayList.splice(result.destination.index, 0, movedTask);
        persistOrder(newDisplayList.map(t => t.id));
    }

    const handleExportPdf = () => {
        if (!auth?.user?.isMax) { setUpgradeModalType('pdf'); return; }
        window.location.href = '/tasks/export';
    };

    // Filter by tab
    const tabFiltered = localTasks.filter(t => {
        const isDone = localDoneIds.has(t.id);
        if (activeTab === 'todo') return !isDone;
        if (activeTab === 'done') return isDone;
        return true; // 'all'
    });

    // Filter by category
    const categoryFiltered = tabFiltered.filter(t => {
        if (activeFilter === 'Semua') return true;
        return t.category.toLowerCase() === activeFilter.toLowerCase();
    });

    // Sort (jika bukan manual)
    const displayList = applySortKey(categoryFiltered, sortKey);

    const todoCount = localTasks.filter(t => !localDoneIds.has(t.id)).length;
    const doneCount = localTasks.filter(t => localDoneIds.has(t.id)).length;
    const currentSortLabel = SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? 'Urutkan';

    return (
        <>
            <Head title="Tugas" />

            <div className="p-8 w-full max-w-5xl mx-auto">
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

                <div className="flex items-center gap-1 mb-5 bg-[#1A1A1A] p-1 rounded-xl w-fit">
                    {([
                        { key: 'all',  label: 'Semua',          count: localTasks.length,  countColor: 'text-text-muted', activeClass: 'bg-[#252525] text-white shadow-sm' },
                        { key: 'todo', label: 'Belum Selesai',  count: todoCount,           countColor: 'text-[#E24B4A]', activeClass: 'bg-[#E24B4A]/20 text-[#E24B4A] shadow-sm' },
                        { key: 'done', label: 'Sudah Selesai',  count: doneCount,           countColor: 'text-[#1D9E75]', activeClass: 'bg-[#1D9E75]/20 text-[#1D9E75] shadow-sm' },
                    ] as const).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === tab.key
                                    ? tab.activeClass
                                    : 'text-text-muted hover:text-white'
                            }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1.5 text-[11px] font-bold ${activeTab === tab.key ? tab.countColor : 'text-text-muted'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Filter Kategori + Sort By ── */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        {CATEGORY_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    activeFilter === f
                                        ? 'bg-[#FF6B1A] text-white'
                                        : 'bg-[#1A1A1A] text-text-muted hover:bg-[#2A2A2A] hover:text-white'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div ref={sortRef} className="relative flex-shrink-0">
                        <button
                            onClick={() => setSortOpen(o => !o)}
                            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-text-muted hover:text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                        >
                            <span className="text-white font-semibold">{currentSortLabel}</span>
                            <FiChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {sortOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border rounded-xl shadow-2xl z-30 overflow-hidden">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-card transition-colors"
                                    >
                                        <span className={sortKey === opt.key ? 'text-primary font-semibold' : 'text-text-muted'}>
                                            {opt.label}
                                        </span>
                                        {sortKey === opt.key && <FiCheck className="text-primary" size={14} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Task List (Draggable kalau sort=manual) ── */}
                {displayList.length === 0 ? (
                    <div className="py-16 text-center bg-[#1A1A1A] rounded-2xl">
                        <p className="text-text-muted text-sm">
                            {activeTab === 'done' ? '🎉 Belum ada tugas yang selesai.' : 'Tidak ada tugas di sini.'}
                        </p>
                    </div>
                ) : sortKey === 'manual' && activeTab !== 'done' ? (
                    // ── Draggable mode ──
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="tasks">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2.5">
                                    {displayList.map((task, index) => {
                                        const badge = categoryBadge[task.category];
                                        const isDone = localDoneIds.has(task.id);
                                        return (
                                            <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
                                                {(drag, snapshot) => (
                                                    <div
                                                        ref={drag.innerRef}
                                                        {...drag.draggableProps}
                                                        className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 transition-all duration-200 ${
                                                            snapshot.isDragging
                                                                ? 'shadow-2xl ring-2 ring-primary opacity-95 border-primary'
                                                                : isDone
                                                                    ? 'border-[#1D9E75]/60 border-b-4 border-b-[#1D9E75]/40 bg-[#1D9E75]/15'
                                                                    : 'bg-[#141414] border-[#2A2A2A] border-b-4 hover:border-[#444]'
                                                        }`}
                                                    >
                                                        {/* Drag handle */}
                                                        <div {...drag.dragHandleProps} className="mr-3 cursor-grab active:cursor-grabbing text-text-muted hover:text-white flex-shrink-0">
                                                            <FiMenu size={16} />
                                                        </div>

                                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                                            <Checkbox
                                                                checked={isDone}
                                                                onCheckedChange={() => toggleDone(task)}
                                                                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${isDone ? 'bg-[#1D9E75] border-[#1D9E75] data-[state=checked]:bg-[#1D9E75] data-[state=checked]:border-[#1D9E75]' : 'border-muted-foreground/40 hover:border-[#1D9E75]'}`}
                                                            />
                                                            <div className="min-w-0">
                                                                <p className={`text-[15px] truncate font-bold ${isDone ? 'text-text-muted line-through' : 'text-foreground'}`}>
                                                                    {task.title}
                                                                </p>
                                                                {task.due_date && (
                                                                    <p className="text-[11px] text-text-muted mt-0.5">
                                                                        📅 {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 flex-shrink-0">
                                                            <span className="rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: badge.bg, color: badge.text }}>
                                                                {badge.label.toUpperCase()}
                                                            </span>
                                                            {task.attachments && task.attachments.length > 0 && (
                                                                <div className="flex h-8 w-10 items-center justify-center rounded-lg border-2 border-[#2A2A2A] bg-[#1E1E1E]">
                                                                    <FiCamera className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1.5 border-l-2 border-[#2A2A2A] pl-4 ml-2">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2A2A2A] rounded-lg" onClick={() => setTaskDetail(task)}><FiEye className="h-4 w-4" /></Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2A2A2A] rounded-lg" onClick={() => openEdit(task)}><FiEdit2 className="h-4 w-4" /></Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg" onClick={() => setTaskToDelete(task)}><FiTrash2 className="h-4 w-4" /></Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                ) : (
                    // ── Static list (sorted / done tab) ──
                    <div className="space-y-2.5">
                        {displayList.map(task => {
                            const badge = categoryBadge[task.category];
                            const isDone = localDoneIds.has(task.id);
                            return (
                                <div
                                    key={task.id}
                                    className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 transition-all duration-200 ${
                                        isDone
                                            ? 'border-success/40 border-b-4 border-b-success/20 bg-success/5'
                                            : 'bg-[#141414] border-[#2A2A2A] border-b-4 hover:border-[#444]'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <Checkbox
                                            checked={isDone}
                                            onCheckedChange={() => toggleDone(task)}
                                            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${isDone ? 'bg-success border-success data-[state=checked]:bg-success data-[state=checked]:border-success' : 'border-muted-foreground/40 hover:border-success'}`}
                                        />
                                        <div className="min-w-0">
                                            <p className={`text-[15px] truncate font-bold ${isDone ? 'text-text-muted line-through' : 'text-foreground'}`}>
                                                {task.title}
                                            </p>
                                            {task.due_date && (
                                                <p className="text-[11px] text-text-muted mt-0.5">
                                                    📅 {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <span className="rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: badge.bg, color: badge.text }}>
                                            {badge.label.toUpperCase()}
                                        </span>
                                        {task.attachments && task.attachments.length > 0 && (
                                            <div className="flex h-8 w-10 items-center justify-center rounded-lg border-2 border-[#2A2A2A] bg-[#1E1E1E]">
                                                <FiCamera className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 border-l-2 border-[#2A2A2A] pl-4 ml-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2A2A2A] rounded-lg" onClick={() => setTaskDetail(task)}><FiEye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[#2A2A2A] rounded-lg" onClick={() => openEdit(task)}><FiEdit2 className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg" onClick={() => setTaskToDelete(task)}><FiTrash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <TaskFormModal open={formOpen} onClose={() => setFormOpen(false)} task={taskToEdit ?? undefined} />
            <ConfirmDialog
                open={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={confirmDelete}
                title="Hapus tugas ini?"
                description={`"${taskToDelete?.title}" akan dihapus permanen.`}
                loading={deleting}
            />
            <TaskDetailSheet open={!!taskDetail} task={taskDetail} onClose={() => setTaskDetail(null)} />
            <UpgradeModal open={upgradeModalType === 'task'} onClose={() => setUpgradeModalType(null)}
                title="Limit Tugas Tercapai"
                description="Kamu telah mencapai batas maksimal tugas bulan ini. Upgrade untuk tugas tak terbatas!"
            />
            <UpgradeModal open={upgradeModalType === 'pdf'} onClose={() => setUpgradeModalType(null)}
                title="Fitur Khusus Max"
                description="Fitur Export ke PDF hanya tersedia untuk pengguna paket Max."
            />
        </>
    );
}
