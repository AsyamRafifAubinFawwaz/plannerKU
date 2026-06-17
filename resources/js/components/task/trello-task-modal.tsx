import React, { useState, useRef, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { FiX, FiClock, FiAlignLeft, FiPaperclip, FiCheckSquare, FiUsers, FiTag, FiTrash2, FiCheck } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ──────────────────────────────────────────────
// Konstanta Label Warna (seperti Trello)
// ──────────────────────────────────────────────
const LABEL_COLORS = [
    { id: 'green',  color: '#1D9E75', name: 'Hijau' },
    { id: 'yellow', color: '#EF9F27', name: 'Kuning' },
    { id: 'orange', color: '#FF6B1A', name: 'Oranye' },
    { id: 'red',    color: '#E24B4A', name: 'Merah' },
    { id: 'purple', color: '#8B5CF6', name: 'Ungu' },
    { id: 'blue',   color: '#378ADD', name: 'Biru' },
];

// Helper untuk fetch senyap (tanpa loading bar Inertia)
function silentFetch(url: string, method: string, body: object) {
    const xsrfToken = document.cookie.split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
        body: JSON.stringify(body),
    });
}

export default function TrelloTaskModal({ task, workspace, onClose }: { task: any, workspace: any, onClose: () => void }) {
    const { auth } = usePage().props as any;
    const [localTask, setLocalTask] = useState(task);
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [showMemberPicker, setShowMemberPicker] = useState(false);
    const labelRef = useRef<HTMLDivElement>(null);
    const memberRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    // Tutup picker saat klik di luar
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (labelRef.current && !labelRef.current.contains(e.target as Node)) setShowLabelPicker(false);
            if (memberRef.current && !memberRef.current.contains(e.target as Node)) setShowMemberPicker(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const form = useForm({
        description: localTask.description || '',
        due_date: localTask.due_date ? new Date(localTask.due_date).toISOString().split('T')[0] : '',
        labels: localTask.labels || [],
        assigned_to: localTask.members?.map((m: any) => m.id) || [],
    });

    const checklistForm = useForm({ title: '' });

    // ──────────────────────────────────────────────
    // Update Deskripsi / Due Date
    // ──────────────────────────────────────────────
    const updateTaskDetails = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.put(`/workspace-tasks/${task.id}`, form.data, { preserveScroll: true });
    };

    // ──────────────────────────────────────────────
    // Upload Lampiran
    // ──────────────────────────────────────────────
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const uploadForm = new FormData();
            uploadForm.append('attachment', file);
            router.post(`/workspace-tasks/${task.id}/attachments`, uploadForm, { preserveScroll: true });
        }
    };

    const deleteAttachment = (index: number) => {
        setLocalTask((prev: any) => {
            const newAttachments = [...(prev.attachments || [])];
            newAttachments.splice(index, 1);
            return { ...prev, attachments: newAttachments };
        });
        router.delete(`/workspace-tasks/${localTask.id}/attachments/${index}`, {
            preserveScroll: true,
            onError: () => setLocalTask(task),
        });
    };

    // ──────────────────────────────────────────────
    // Checklist — pakai fetch senyap (tanpa loading bar)
    // ──────────────────────────────────────────────
    const addChecklist = (e: React.FormEvent) => {
        e.preventDefault();
        const newChecklist = { id: Date.now(), title: checklistForm.data.title, is_done: false };
        setLocalTask((prev: any) => ({ ...prev, checklists: [...(prev.checklists || []), newChecklist] }));

        router.post(`/workspace-tasks/${localTask.id}/checklists`, checklistForm.data, {
            preserveScroll: true,
            onSuccess: () => checklistForm.reset(),
            onError: () => setLocalTask(task),
        });
    };

    const toggleChecklist = (id: number, is_done: boolean) => {
        // Optimistic update — langsung ubah di UI
        setLocalTask((prev: any) => ({
            ...prev,
            checklists: prev.checklists.map((c: any) => c.id === id ? { ...c, is_done: !is_done } : c),
        }));
        // Kirim ke server secara senyap tanpa loading bar
        silentFetch(`/workspace-task-checklists/${id}`, 'PATCH', { is_done: !is_done })
            .catch(() => setLocalTask(task));
    };

    // ──────────────────────────────────────────────
    // Label — toggle warna, simpan senyap
    // ──────────────────────────────────────────────
    const toggleLabel = (labelId: string) => {
        const currentLabels: string[] = localTask.labels || [];
        const newLabels = currentLabels.includes(labelId)
            ? currentLabels.filter((l: string) => l !== labelId)
            : [...currentLabels, labelId];

        setLocalTask((prev: any) => ({ ...prev, labels: newLabels }));
        form.setData('labels', newLabels);
        silentFetch(`/workspace-tasks/${localTask.id}`, 'PUT', {
            description: form.data.description,
            due_date: form.data.due_date,
            labels: newLabels,
            assigned_to: localTask.members?.map((m: any) => m.id) || [],
        });
    };

    // ──────────────────────────────────────────────
    // Anggota — toggle assign/unassign, senyap
    // ──────────────────────────────────────────────
    const toggleMember = (member: any) => {
        const currentMemberIds: number[] = localTask.members?.map((m: any) => m.id) || [];
        const isAssigned = currentMemberIds.includes(member.id);

        const newMembers = isAssigned
            ? localTask.members.filter((m: any) => m.id !== member.id)
            : [...(localTask.members || []), member];

        setLocalTask((prev: any) => ({ ...prev, members: newMembers }));
        silentFetch(`/workspace-tasks/${localTask.id}`, 'PUT', {
            description: form.data.description,
            due_date: form.data.due_date,
            labels: localTask.labels || [],
            assigned_to: newMembers.map((m: any) => m.id),
        });
    };

    const activeLabels: string[] = localTask.labels || [];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-xl w-full max-w-3xl relative mt-10 mb-10 animate-in fade-in zoom-in duration-200">

                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-muted hover:text-white bg-card hover:bg-[#2A2A2A] rounded-full transition-colors z-10">
                    <FiX size={20} />
                </button>

                {/* Header */}
                <div className="p-6 pb-2">
                    <div className="flex items-start gap-3 mb-3 flex-wrap">
                        <span className="bg-card border border-border px-2 py-1 rounded text-xs font-semibold text-text-muted">
                            {localTask.column?.name || 'Kolom'}
                        </span>
                        {/* Badge label aktif */}
                        {activeLabels.map(lId => {
                            const lDef = LABEL_COLORS.find(l => l.id === lId);
                            if (!lDef) return null;
                            return (
                                <span key={lId} className="px-3 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: lDef.color }}>
                                    {lDef.name}
                                </span>
                            );
                        })}
                    </div>
                    <h2 className="text-2xl font-bold text-white pr-10">{localTask.title}</h2>
                </div>

                {/* 2-Column Main Content */}
                <div className="p-6 pt-4 flex flex-col md:flex-row gap-8">

                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-8 min-w-0">

                        {/* Anggota yang di-assign */}
                        {localTask.members && localTask.members.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider">Anggota</h4>
                                <div className="flex flex-wrap gap-2">
                                    {localTask.members.map((member: any) => (
                                        <div key={member.id} className="flex items-center gap-2 bg-card border border-border px-2 py-1 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-xs text-white">{member.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Due Date badge */}
                        {localTask.due_date && (
                            <div>
                                <h4 className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider">Tenggat Waktu</h4>
                                <div className="inline-flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded text-sm text-white font-semibold">
                                    <FiClock className="text-warning" />
                                    {new Date(localTask.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <FiAlignLeft className="text-text-muted" size={20} />
                                <h3 className="text-lg font-bold text-white">Deskripsi</h3>
                            </div>
                            <form onBlur={updateTaskDetails}>
                                <textarea
                                    className="w-full bg-card border border-border rounded-xl p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] text-sm resize-none"
                                    placeholder="Tambahkan deskripsi lebih detail..."
                                    value={form.data.description}
                                    onChange={e => form.setData('description', e.target.value)}
                                />
                            </form>
                        </div>

                        {/* Attachments */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <FiPaperclip className="text-text-muted" size={20} />
                                <h3 className="text-lg font-bold text-white">Lampiran</h3>
                            </div>
                            {localTask.attachments && localTask.attachments.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {localTask.attachments.map((file: any, index: number) => (
                                        <div key={index} className="flex items-center gap-3 bg-surface border border-border rounded-xl p-3 group">
                                            <div className="w-12 h-12 rounded bg-card flex items-center justify-center text-text-muted flex-shrink-0 overflow-hidden">
                                                {file.path?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                    <img src={`/storage/${file.path}`} className="w-full h-full object-cover" alt={file.name} />
                                                ) : (
                                                    <span className="text-xs font-bold uppercase">{file.name?.split('.').pop()}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                                <a href={`/storage/${file.path}`} target="_blank" rel="noreferrer" className="text-xs text-text-muted hover:text-primary transition-colors">Unduh</a>
                                            </div>
                                            <button onClick={() => deleteAttachment(index)} className="p-2 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-muted text-sm bg-card p-4 rounded-xl border border-border border-dashed text-center">Belum ada lampiran file.</p>
                            )}
                        </div>

                        {/* Checklist */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <FiCheckSquare className="text-text-muted" size={20} />
                                <h3 className="text-lg font-bold text-white">Checklist</h3>
                                {localTask.checklists?.length > 0 && (
                                    <span className="text-xs text-text-muted ml-auto">
                                        {localTask.checklists.filter((c: any) => c.is_done).length}/{localTask.checklists.length}
                                    </span>
                                )}
                            </div>

                            {/* Progress bar */}
                            {localTask.checklists?.length > 0 && (
                                <div className="w-full bg-card rounded-full h-2 mb-4 border border-border overflow-hidden">
                                    <div
                                        className="bg-success h-full transition-all duration-300"
                                        style={{ width: `${(localTask.checklists.filter((c: any) => c.is_done).length / localTask.checklists.length) * 100}%` }}
                                    />
                                </div>
                            )}

                            <div className="space-y-2 mb-4">
                                {localTask.checklists?.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 bg-surface border border-border p-2 px-3 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                                        onClick={() => toggleChecklist(item.id, item.is_done)}
                                    >
                                        {/* Checkbox gamifikasi — klik langsung, tanpa loading */}
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all duration-150
                                            ${item.is_done ? 'bg-success border-success scale-110' : 'border-text-muted hover:border-primary'}`}>
                                            {item.is_done && <FiCheck className="text-white" size={12} />}
                                        </div>
                                        <span className={`text-sm flex-1 select-none ${item.is_done ? 'line-through text-text-muted' : 'text-white'}`}>
                                            {item.title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Form tambah checklist */}
                            <form onSubmit={addChecklist} className="flex items-center gap-2">
                                <Input
                                    value={checklistForm.data.title}
                                    onChange={e => checklistForm.setData('title', e.target.value)}
                                    placeholder="Tambah item baru..."
                                    className="bg-card border-border text-sm text-white focus:ring-1 focus:ring-primary"
                                />
                                <Button type="submit" disabled={!checklistForm.data.title || checklistForm.processing} className="bg-primary hover:bg-[#FF8C42] text-white shrink-0">
                                    Tambah
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column (Sidebar Actions) */}
                    <div className="w-full md:w-48 flex-shrink-0 space-y-4">
                        <div>
                            <h4 className="text-[11px] font-semibold text-text-muted mb-2 uppercase tracking-wider">Tambahkan ke kartu</h4>
                            <div className="space-y-2">

                                {/* ── Tombol Anggota ── */}
                                <div ref={memberRef} className="relative">
                                    <button
                                        onClick={() => { setShowMemberPicker(o => !o); setShowLabelPicker(false); }}
                                        className="w-full bg-card hover:bg-[#2A2A2A] border border-border text-white text-sm font-medium py-1.5 px-3 rounded flex items-center gap-2 transition-colors"
                                    >
                                        <FiUsers className="text-text-muted" /> Anggota
                                    </button>
                                    {showMemberPicker && (
                                        <div className="absolute left-0 top-full mt-1 w-64 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                            <div className="p-3 border-b border-border">
                                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Anggota Workspace</p>
                                            </div>
                                            <div className="p-2 max-h-48 overflow-y-auto">
                                                {workspace.members?.map((member: any) => {
                                                    const isAssigned = localTask.members?.some((m: any) => m.id === member.id);
                                                    return (
                                                        <button
                                                            key={member.id}
                                                            onClick={() => toggleMember(member)}
                                                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                                                                {member.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm text-white flex-1 text-left">{member.name}</span>
                                                            {isAssigned && <FiCheck className="text-success" size={16} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Tombol Label ── */}
                                <div ref={labelRef} className="relative">
                                    <button
                                        onClick={() => { setShowLabelPicker(o => !o); setShowMemberPicker(false); }}
                                        className="w-full bg-card hover:bg-[#2A2A2A] border border-border text-white text-sm font-medium py-1.5 px-3 rounded flex items-center gap-2 transition-colors"
                                    >
                                        <FiTag className="text-text-muted" /> Label
                                    </button>
                                    {showLabelPicker && (
                                        <div className="absolute left-0 top-full mt-1 w-64 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                            <div className="p-3 border-b border-border">
                                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Pilih Label</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                {LABEL_COLORS.map(label => {
                                                    const isActive = activeLabels.includes(label.id);
                                                    return (
                                                        <button
                                                            key={label.id}
                                                            onClick={() => toggleLabel(label.id)}
                                                            className="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-card transition-colors"
                                                        >
                                                            <div
                                                                className="flex-1 h-8 rounded-md flex items-center px-3"
                                                                style={{ backgroundColor: label.color }}
                                                            >
                                                                <span className="text-white text-sm font-bold">{label.name}</span>
                                                            </div>
                                                            {isActive && <FiCheck className="text-white flex-shrink-0" size={16} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Tombol Tenggat Waktu ── */}
                                <div className="relative w-full">
                                    <input
                                        type="date"
                                        value={form.data.due_date}
                                        onChange={e => {
                                            form.setData('due_date', e.target.value);
                                            setTimeout(() => updateTaskDetails(), 100);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                    />
                                    <button className="w-full bg-card hover:bg-[#2A2A2A] border border-border text-white text-sm font-medium py-1.5 px-3 rounded flex items-center gap-2 transition-colors pointer-events-none">
                                        <FiClock className="text-text-muted" /> Tenggat Waktu
                                    </button>
                                </div>

                                {/* ── Tombol Lampiran ── */}
                                <label className="cursor-pointer w-full bg-card hover:bg-[#2A2A2A] border border-border text-white text-sm font-medium py-1.5 px-3 rounded flex items-center gap-2 transition-colors">
                                    <FiPaperclip className="text-text-muted" /> Lampiran
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
