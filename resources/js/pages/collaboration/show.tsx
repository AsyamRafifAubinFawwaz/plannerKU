import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiChevronLeft, FiUserPlus, FiImage, FiX, FiMoreHorizontal, FiClock, FiCheckSquare, FiPaperclip } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import TrelloTaskModal from '@/components/task/trello-task-modal';

// Peta warna label — harus sinkron dengan LABEL_COLORS di trello-task-modal.tsx
const CARD_LABEL_COLORS: Record<string, string> = {
    green:  '#1D9E75',
    yellow: '#EF9F27',
    orange: '#FF6B1A',
    red:    '#E24B4A',
    purple: '#8B5CF6',
    blue:   '#378ADD',
};

export default function CollaborationShow({ workspace }: any) {
    const { auth } = usePage().props as any;
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [activeColumnId, setActiveColumnId] = useState<number | null>(null);
    const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
    const [createColumnOpen, setCreateColumnOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<any | null>(null);
    const [localColumns, setLocalColumns] = useState(workspace.columns || []);

    useEffect(() => {
        setLocalColumns(workspace.columns || []);
        
        if (activeTask) {
            for (const col of workspace.columns || []) {
                const updatedTask = col.tasks?.find((t: any) => t.id === activeTask.id);
                if (updatedTask) {
                    setActiveTask({ ...updatedTask, column: col });
                    break;
                }
            }
        }
    }, [workspace.columns]);

    useEffect(() => {
        if (!workspace.id || !(window as any).Echo) return;

        const channel = (window as any).Echo.private(`workspace.${workspace.id}`)
            .listen('WorkspaceUpdated', (e: any) => {
                // Instantly update the board when other users move cards
                setLocalColumns(e.columns);
            });

        return () => {
            channel.stopListening('WorkspaceUpdated');
            (window as any).Echo.leave(`workspace.${workspace.id}`);
        };
    }, [workspace.id]);

    const taskForm = useForm({
        column_id: '',
        title: '',
        image: null as File | null,
    });

    const inviteForm = useForm({
        email: '',
    });

    const columnForm = useForm({
        name: '',
    });

    const submitTask = (e: React.FormEvent) => {
        e.preventDefault();
        taskForm.post(`/collaboration/${workspace.id}/tasks`, {
            onSuccess: () => {
                setCreateTaskOpen(false);
                setImagePreview(null);
                taskForm.reset();
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            taskForm.setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submitInvite = (e: React.FormEvent) => {
        e.preventDefault();
        inviteForm.post(`/collaboration/${workspace.id}/members`, {
            onSuccess: () => {
                setInviteMemberOpen(false);
                inviteForm.reset();
            },
        });
    };

    const submitColumn = (e: React.FormEvent) => {
        e.preventDefault();
        columnForm.post(`/workspaces/${workspace.id}/columns`, {
            onSuccess: () => {
                setCreateColumnOpen(false);
                columnForm.reset();
            },
        });
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        if (result.type === 'COLUMN') {
            const newColumns = Array.from(localColumns) as any[];
            const [reorderedItem] = newColumns.splice(source.index, 1);
            newColumns.splice(destination.index, 0, reorderedItem);

            setLocalColumns(newColumns);
            
            const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
            fetch(`/workspaces/${workspace.id}/columns/order`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : ''
                },
                body: JSON.stringify({ columns: newColumns.map(c => c.id) })
            });
            return;
        }

        const taskId = parseInt(draggableId.replace('task-', ''));
        const sourceColId = parseInt(source.droppableId.replace('col-', ''));
        const destColId = parseInt(destination.droppableId.replace('col-', ''));

        // Optimistic UI update
        const newColumns = JSON.parse(JSON.stringify(localColumns));
        const sourceCol = newColumns.find((c: any) => c.id === sourceColId);
        const destCol = newColumns.find((c: any) => c.id === destColId);
        
        const [movedTask] = sourceCol.tasks.splice(source.index, 1);
        movedTask.column_id = destColId;
        destCol.tasks.splice(destination.index, 0, movedTask);
        
        // Update orders
        const updatedTasks: any[] = [];
        destCol.tasks.forEach((t: any, i: number) => {
            t.order = i + 1;
            updatedTasks.push({ id: t.id, column_id: destColId, order: t.order });
        });

        if (sourceColId !== destColId) {
            sourceCol.tasks.forEach((t: any, i: number) => {
                t.order = i + 1;
                updatedTasks.push({ id: t.id, column_id: sourceColId, order: t.order });
            });
        }

        setLocalColumns(newColumns);

        // Use fetch instead of router.patch to prevent Inertia progress bar
        const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
        fetch(`/workspaces/${workspace.id}/tasks/order`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : ''
            },
            body: JSON.stringify({ tasks: updatedTasks })
        }).catch(() => {
            setLocalColumns(workspace.columns || []);
        });
    };

    const openCreateTask = (columnId: number) => {
        setActiveColumnId(columnId);
        taskForm.setData('column_id', columnId.toString());
        setCreateTaskOpen(true);
    };

    return (
        <>
            <Head title={workspace.name} />

            <div className="p-8 w-full max-w-[100vw] overflow-x-hidden h-[calc(100vh-64px)] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-sm text-text-muted">
                            <Link href="/collaboration" className="hover:text-white transition-colors flex items-center gap-1">
                                <FiChevronLeft /> Ruang Kerja
                            </Link>
                            <span>/</span>
                            <span className="text-white">{workspace.name}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">{workspace.name}</h1>
                        <p className="text-text-muted text-sm">{workspace.description || 'Papan Kanban Tim'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 mr-4">
                            {workspace.members.slice(0, 5).map((member: any) => (
                                <div key={member.id} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold border-2 border-surface shadow-sm" title={member.name}>
                                    {member.name.substring(0, 2).toUpperCase()}
                                </div>
                            ))}
                            {workspace.members.length > 5 && (
                                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-xs text-text-muted font-bold border-2 border-surface shadow-sm">
                                    +{workspace.members.length - 5}
                                </div>
                            )}
                        </div>
                        {/* Hanya Max yang bisa undang anggota */}
                        {workspace.owner_id === auth.user.id && auth.limits?.canInviteMember && (
                            <button
                                onClick={() => setInviteMemberOpen(true)}
                                className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] text-text-muted hover:text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all active:translate-y-[2px] active:border-b-[1px]"
                            >
                                <FiUserPlus /> Undang
                            </button>
                        )}
                        {/* Pro: tampilkan info batas tapi tidak bisa undang */}
                        {workspace.owner_id === auth.user.id && !auth.limits?.canInviteMember && auth.user.isPro && (
                            <Link
                                href="/pricing"
                                className="bg-warning/10 border border-warning/30 text-warning px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 text-xs transition-all hover:bg-warning/20"
                                title="Upgrade ke Max untuk mengundang anggota"
                            >
                                <FiUserPlus /> Upgrade untuk Undang
                            </Link>
                        )}
                    </div>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div 
                                className="flex gap-6 overflow-x-auto pb-6 flex-1 items-start"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                
                                {localColumns.map((column: any, index: number) => (
                                    <Draggable key={`col-${column.id}`} draggableId={`col-${column.id}`} index={index}>
                                        {(provided) => (
                                            <div 
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-2xl w-80 flex-shrink-0 flex flex-col max-h-full shadow-lg"
                                            >
                                                <div {...provided.dragHandleProps} className="p-4 flex items-center justify-between border-b border-border/50">
                                                    <h3 className="font-bold text-white truncate pr-2">{column.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-card border border-border text-text-muted text-xs font-bold px-2 py-1 rounded-md">
                                                    {column.tasks?.length || 0}
                                                </span>
                                                <button className="text-text-muted hover:text-white p-1 rounded transition-colors">
                                                    <FiMoreHorizontal />
                                                </button>
                                            </div>
                                        </div>

                                        <Droppable droppableId={`col-${column.id}`} type="TASK">
                                            {(taskProvided, dropSnapshot) => (
                                                <div 
                                                    className={`p-3 overflow-y-auto flex-1 custom-scrollbar min-h-[100px] space-y-3 ${dropSnapshot.isDraggingOver ? 'bg-[#1A1A1A]' : ''}`}
                                                    ref={taskProvided.innerRef}
                                                    {...taskProvided.droppableProps}
                                                >
                                                    {column.tasks?.map((task: any, index: number) => (
                                                        <Draggable key={`task-${task.id}`} draggableId={`task-${task.id}`} index={index}>
                                                            {(dragProvided, dragSnapshot) => (
                                                                <div 
                                                                    ref={dragProvided.innerRef}
                                                                    {...dragProvided.draggableProps}
                                                                    {...dragProvided.dragHandleProps}
                                                                    onClick={() => setActiveTask({...task, column})}
                                                                    className={`bg-card border p-3 rounded-xl group relative transition-colors duration-200 cursor-pointer
                                                                        ${dragSnapshot.isDragging ? 'shadow-2xl ring-2 ring-primary border-transparent z-50 opacity-90' : 'border-border hover:border-primary/50'}`}
                                                                >
                                                                    {task.cover_image && (
                                                                        <img src={`/storage/${task.cover_image}`} alt="Task cover" className="w-full h-32 object-cover rounded-lg mb-3" />
                                                                    )}

                                                                    {/* Label badges — bar warna di atas judul seperti Trello */}
                                                                    {task.labels && task.labels.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                                            {task.labels.map((labelId: string) => {
                                                                                const labelDef = CARD_LABEL_COLORS[labelId];
                                                                                if (!labelDef) return null;
                                                                                return (
                                                                                    <div
                                                                                        key={labelId}
                                                                                        className="h-2 w-10 rounded-full"
                                                                                        style={{ backgroundColor: labelDef }}
                                                                                        title={labelId}
                                                                                    />
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}

                                                                    <p className="text-sm text-foreground font-medium">{task.title}</p>
                                                                    
                                                                    {/* Trello features tags / members */}
                                                                    {(task.due_date || task.checklists?.length > 0 || task.attachments?.length > 0) && (
                                                                        <div className="flex flex-wrap items-center gap-2 mt-3 text-text-muted">
                                                                            {task.due_date && (
                                                                                <div className="text-[10px] bg-surface px-2 py-1 rounded border border-border flex items-center gap-1 font-medium" title="Tenggat Waktu">
                                                                                    <FiClock size={10} />
                                                                                    {new Date(task.due_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                                                </div>
                                                                            )}
                                                                            {task.checklists?.length > 0 && (
                                                                                <div className="text-[10px] flex items-center gap-1">
                                                                                    <FiCheckSquare size={12} className={task.checklists.every((c: any) => c.is_done) ? 'text-success' : ''} />
                                                                                    <span>{task.checklists.filter((c: any) => c.is_done).length}/{task.checklists.length}</span>
                                                                                </div>
                                                                            )}
                                                                            {task.attachments?.length > 0 && (
                                                                                <div className="text-[10px] flex items-center gap-1">
                                                                                    <FiPaperclip size={12} />
                                                                                    <span>{task.attachments.length}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {taskProvided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>

                                        <div className="p-3 pt-0 border-t border-border/50 bg-surface/50 rounded-b-2xl mt-auto">
                                            <button 
                                                onClick={() => openCreateTask(column.id)} 
                                                className="w-full text-text-muted hover:text-white text-sm font-medium py-2 rounded-lg hover:bg-card transition-colors flex items-center justify-start gap-2 px-3 group"
                                            >
                                                <FiPlus className="group-hover:text-primary transition-colors" /> Tambah kartu
                                            </button>
                                        </div>
                                    </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                {/* Add Column Button */}
                                <div className="w-80 flex-shrink-0">
                                    {!createColumnOpen ? (
                                <button 
                                    onClick={() => setCreateColumnOpen(true)}
                                    className="bg-surface/50 border border-dashed border-border text-text-muted hover:text-white w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-surface hover:border-primary transition-all"
                                >
                                    <FiPlus /> Tambah Daftar Lain
                                </button>
                            ) : (
                                <div className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-2xl p-3 shadow-lg">
                                    <form onSubmit={submitColumn}>
                                        <Input
                                            value={columnForm.data.name}
                                            onChange={e => columnForm.setData('name', e.target.value)}
                                            className="bg-card border-border text-white mb-3"
                                            placeholder="Masukkan judul daftar..."
                                            autoFocus
                                            required
                                        />
                                        <div className="flex items-center gap-2">
                                            <Button type="submit" disabled={columnForm.processing} className="bg-primary hover:bg-[#FF8C42] text-white rounded-lg h-9">
                                                Tambah Daftar
                                            </Button>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setCreateColumnOpen(false);
                                                    columnForm.reset();
                                                }} 
                                                className="p-2 text-text-muted hover:text-white transition-colors"
                                            >
                                                <FiX size={20} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Create Task Modal */}
            {createTaskOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-4">Tambah Kartu Baru</h2>
                        <form onSubmit={submitTask} className="space-y-4">
                            <div>
                                <Input
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                    className="bg-card border-border text-white mb-4"
                                    placeholder="Apa yang perlu dikerjakan?"
                                    autoFocus
                                    required
                                />
                                {taskForm.errors.title && <p className="text-danger text-xs mt-1 mb-4">{taskForm.errors.title}</p>}
                                
                                <div className="border border-dashed border-border rounded-xl p-4 text-center">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img src={imagePreview} className="max-h-32 rounded-lg" alt="Preview" />
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    taskForm.setData('image', null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1 shadow-lg"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center text-text-muted hover:text-white transition-colors">
                                            <FiImage size={24} className="mb-2" />
                                            <span className="text-sm font-medium">Klik untuk menyisipkan cover/gambar</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                {taskForm.errors.image && <p className="text-danger text-xs mt-1">{taskForm.errors.image}</p>}
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                                <Button type="button" variant="ghost" onClick={() => setCreateTaskOpen(false)} className="text-text-muted hover:text-white">Batal</Button>
                                <Button type="submit" disabled={taskForm.processing} className="bg-primary hover:bg-[#FF8C42] text-white rounded-lg">
                                    {taskForm.processing ? 'Menyimpan...' : 'Tambahkan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Member Modal */}
            {inviteMemberOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-4">Undang Anggota Tim</h2>
                        <form onSubmit={submitInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Alamat Email Anggota</label>
                                <Input
                                    type="email"
                                    value={inviteForm.data.email}
                                    onChange={e => inviteForm.setData('email', e.target.value)}
                                    className="bg-card border-border text-white"
                                    placeholder="email@contoh.com"
                                    autoFocus
                                    required
                                />
                                {inviteForm.errors.email && <p className="text-danger text-xs mt-1">{inviteForm.errors.email}</p>}
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                                <Button type="button" variant="ghost" onClick={() => setInviteMemberOpen(false)} className="text-text-muted hover:text-white">Batal</Button>
                                <Button type="submit" disabled={inviteForm.processing} className="bg-primary hover:bg-[#FF8C42] text-white rounded-lg">
                                    {inviteForm.processing ? 'Mengundang...' : 'Undang Sekarang'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTask && (
                <TrelloTaskModal 
                    task={activeTask} 
                    workspace={workspace} 
                    onClose={() => setActiveTask(null)} 
                />
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #333;
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #555;
                }
            `}</style>
        </>
    );
}
