import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Calendar, Tag, AlignLeft, CheckCircle2, Circle } from 'lucide-react';

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
    task: Task | null;
    open: boolean;
    onClose: () => void;
}

const categoryBadge: Record<string, { bg: string; text: string; label: string }> = {
    kuliah: { bg: '#1E1A3A', text: '#A89BE8', label: 'Kuliah' },
    harian: { bg: '#1E1E1E', text: '#888888', label: 'Harian' },
    penting: { bg: '#FF6B1A1A', text: '#FF6B1A', label: 'Penting' },
};

export function TaskDetailSheet({ task, open, onClose }: Props) {
    if (!task) return null;
    const badge = categoryBadge[task.category];

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader className="mb-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                        {task.is_done ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span
                            className="flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={{ background: badge.bg, color: badge.text }}
                        >
                            {badge.label}
                        </span>
                    </div>
                    <SheetTitle className={`text-xl ${task.is_done ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </SheetTitle>
                    <SheetDescription>
                        Detail lengkap tugas kamu.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <div className="space-y-3 text-sm text-foreground">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Deadline: {task.due_date || 'Tidak ada deadline'}</span>
                        </div>
                        {task.done_at && (
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                <span>Selesai pada: {new Date(task.done_at).toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlignLeft className="w-4 h-4" />
                            <h4 className="text-sm font-medium">Catatan</h4>
                        </div>
                        {task.notes ? (
                            <div className="p-3 bg-card border border-border rounded-lg text-sm whitespace-pre-wrap">
                                {task.notes}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Tidak ada catatan.</p>
                        )}
                    </div>

                    {task.attachments && task.attachments.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Lampiran Foto</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {task.attachments.map((path, idx) => (
                                    <a
                                        key={idx}
                                        href={`/storage/${path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block aspect-square rounded-lg border border-border overflow-hidden hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            src={`/storage/${path}`}
                                            alt={`Lampiran ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground">Klik gambar untuk melihat ukuran penuh</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
