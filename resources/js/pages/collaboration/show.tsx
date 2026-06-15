import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiChevronLeft, FiUserPlus, FiImage, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function CollaborationShow({ workspace }: any) {
    const { auth } = usePage().props as any;
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [localTasks, setLocalTasks] = useState(workspace.tasks || []);

    useEffect(() => {
        setLocalTasks(workspace.tasks || []);
    }, [workspace.tasks]);

    const taskForm = useForm({
        title: '',
        image: null as File | null,
    });

    const inviteForm = useForm({
        email: '',
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

    const updateTaskStatus = (taskId: number, newStatus: string) => {
        // Optimistic UI update
        setLocalTasks((prev: any[]) => 
            prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task)
        );

        router.patch(`/workspace-tasks/${taskId}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onError: () => {
                // Revert on error
                setLocalTasks(workspace.tasks || []);
            }
        });
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) {
            return;
        }

        const taskId = parseInt(draggableId.replace('task-', ''));
        const newStatus = destination.droppableId;
        
        updateTaskStatus(taskId, newStatus);
    };

    const tasksTodo = localTasks.filter((t: any) => t.status === 'todo');
    const tasksDoing = localTasks.filter((t: any) => t.status === 'doing');
    const tasksDone = localTasks.filter((t: any) => t.status === 'done');

    return (
        <>
            <Head title={workspace.name} />

            <div className="p-8 w-full max-w-6xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
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
                        {workspace.owner_id === auth.user.id && (
                            <button 
                                onClick={() => setInviteMemberOpen(true)}
                                className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] text-text-muted hover:text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all active:translate-y-[2px] active:border-b-[1px]"
                            >
                                <FiUserPlus /> Undang
                            </button>
                        )}
                        <button 
                            onClick={() => setCreateTaskOpen(true)}
                            className="bg-primary border-b-4 border-b-[#C4500D] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all active:translate-y-[2px] active:border-b-[1px]"
                        >
                            <FiPlus /> Kartu Baru
                        </button>
                    </div>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
                        
                        {/* To Do */}
                        <Droppable droppableId="todo">
                            {(provided) => (
                                <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-2xl p-4 w-80 flex-shrink-0 flex flex-col h-max max-h-full"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">To Do</h3>
                                        <span className="bg-card text-text-muted text-xs font-bold px-2 py-1 rounded-md">{tasksTodo.length}</span>
                                    </div>
                                    <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                                        {tasksTodo.map((task: any, index: number) => (
                                            <Draggable key={task.id.toString()} draggableId={`task-${task.id}`} index={index}>
                                                {(provided) => (
                                                    <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-card border border-border p-3 rounded-xl group relative active:rotate-2 active:scale-105 transition-transform"
                                                    >
                                                        {task.image_path && (
                                                            <img src={`/storage/${task.image_path}`} alt="Task cover" className="w-full h-32 object-cover rounded-lg mb-3" />
                                                        )}
                                                        <p className="text-sm text-foreground font-medium">{task.title}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        <button onClick={() => setCreateTaskOpen(true)} className="w-full text-text-muted hover:text-white text-sm font-medium py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-1 mt-2">
                                            <FiPlus /> Tambah kartu
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Droppable>

                        {/* Doing */}
                        <Droppable droppableId="doing">
                            {(provided) => (
                                <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-2xl p-4 w-80 flex-shrink-0 flex flex-col h-max max-h-full"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">Doing</h3>
                                        <span className="bg-card text-text-muted text-xs font-bold px-2 py-1 rounded-md">{tasksDoing.length}</span>
                                    </div>
                                    <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                                        {tasksDoing.map((task: any, index: number) => (
                                            <Draggable key={task.id.toString()} draggableId={`task-${task.id}`} index={index}>
                                                {(provided) => (
                                                    <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-card border border-border p-3 rounded-xl border-l-4 border-l-warning group relative active:rotate-2 active:scale-105 transition-transform"
                                                    >
                                                        {task.image_path && (
                                                            <img src={`/storage/${task.image_path}`} alt="Task cover" className="w-full h-32 object-cover rounded-lg mb-3" />
                                                        )}
                                                        <p className="text-sm text-foreground font-medium">{task.title}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>

                        {/* Done */}
                        <Droppable droppableId="done">
                            {(provided) => (
                                <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-2xl p-4 w-80 flex-shrink-0 flex flex-col h-max max-h-full"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">Done</h3>
                                        <span className="bg-card text-text-muted text-xs font-bold px-2 py-1 rounded-md">{tasksDone.length}</span>
                                    </div>
                                    <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                                        {tasksDone.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                                                <p className="text-sm font-medium">Belum ada tugas selesai</p>
                                            </div>
                                        ) : (
                                            tasksDone.map((task: any, index: number) => (
                                                <Draggable key={task.id.toString()} draggableId={`task-${task.id}`} index={index}>
                                                    {(provided) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-card border border-border p-3 rounded-xl border-l-4 border-l-success opacity-70 group relative active:rotate-2 active:scale-105 transition-transform"
                                                        >
                                                            {task.image_path && (
                                                                <img src={`/storage/${task.image_path}`} alt="Task cover" className="w-full h-32 object-cover rounded-lg mb-3 opacity-80" />
                                                            )}
                                                            <p className="text-sm text-foreground font-medium line-through">{task.title}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>

            {/* Create Task Modal */}
            {createTaskOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-4">Tambah Kartu</h2>
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
                                                className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center text-text-muted hover:text-white transition-colors">
                                            <FiImage size={24} className="mb-2" />
                                            <span className="text-sm font-medium">Klik untuk tambah gambar (opsional)</span>
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
        </>
    );
}
