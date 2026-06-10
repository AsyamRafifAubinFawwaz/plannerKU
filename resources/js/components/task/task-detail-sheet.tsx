import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FiCalendar, FiAlignLeft, FiCheckCircle, FiCircle, FiCamera, FiX } from 'react-icons/fi';
import { useState } from 'react';

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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!task) return null;
    const badge = categoryBadge[task.category];

    return (
        <>
            <Sheet open={open} onOpenChange={onClose}>
                <SheetContent className="overflow-y-auto sm:max-w-md pl-6 sm:pl-8">
                <SheetHeader className="mb-6 text-left">
                    <div className="flex items-center gap-3 mb-4">
                        {task.is_done ? (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B1A]/20 text-[#FF6B1A]">
                                <FiCheckCircle className="w-5 h-5" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A2A2A] text-muted-foreground">
                                <FiCircle className="w-5 h-5" />
                            </div>
                        )}
                        <span
                            className="flex-shrink-0 rounded-full px-3 py-1 text-[12px] font-bold tracking-wide uppercase"
                            style={{ background: badge.bg, color: badge.text }}
                        >
                            {badge.label}
                        </span>
                    </div>
                    <SheetTitle className={`text-2xl font-black leading-tight ${task.is_done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                    </SheetTitle>
                    <SheetDescription className="text-[13px] mt-1">
                        Detail lengkap misimu.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4">
                    {/* Kotak Info Tanggal */}
                    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4">
                        <div className="flex items-center gap-3 text-[14px] font-medium text-foreground">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A1A1A]">
                                <FiCalendar className="w-4 h-4 text-[#FF6B1A]" />
                            </div>
                            <span>{task.due_date ? `Deadline: ${task.due_date}` : 'Tidak ada deadline'}</span>
                        </div>
                        {task.done_at && (
                            <div className="flex items-center gap-3 text-[14px] font-medium text-foreground">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A1A1A]">
                                    <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span>Selesai: {new Date(task.done_at).toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>

                    {/* Kotak Catatan */}
                    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4">
                        <div className="flex items-center gap-3 text-[14px] font-bold text-foreground mb-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A1A1A]">
                                <FiAlignLeft className="w-4 h-4 text-[#A89BE8]" />
                            </div>
                            <span>Catatan</span>
                        </div>
                        {task.notes ? (
                            <div className="px-1 text-[14px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {task.notes}
                            </div>
                        ) : (
                            <p className="px-1 text-[13px] text-muted-foreground/50 italic">Tidak ada catatan.</p>
                        )}
                    </div>

                    {/* Kotak Lampiran */}
                    {task.attachments && task.attachments.length > 0 && (
                        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4">
                            <div className="flex items-center gap-3 text-[14px] font-bold text-foreground mb-1">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A1A1A]">
                                    <FiCamera className="w-4 h-4 text-[#888888]" />
                                </div>
                                <span>Lampiran Foto</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {task.attachments.map((path, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(path)}
                                        className="block aspect-square rounded-xl border-2 border-[#2A2A2A] overflow-hidden hover:opacity-80 hover:-translate-y-1 transition-all cursor-pointer"
                                    >
                                        <img
                                            src={`/storage/${path}`}
                                            alt={`Lampiran ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] font-medium text-muted-foreground/60 text-center mt-2">
                                Klik gambar untuk melihat ukuran penuh
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>

        {/* Fullscreen Image Overlay (Lightbox) */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-transparent border-none shadow-none flex items-center justify-center">
                <DialogTitle className="sr-only">Lampiran Foto</DialogTitle>
                <DialogDescription className="sr-only">Tampilan penuh lampiran foto tugas</DialogDescription>
                
                <div className="relative flex items-center justify-center w-full h-[85vh]">
                    {/* Tombol X custom (opsional, backup dari close default) */}
                    <button 
                        className="absolute top-0 right-0 md:-top-4 md:-right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border-2 border-[#2A2A2A] text-white hover:bg-[#FF6B1A] hover:border-[#FF6B1A] transition-colors z-[110]"
                        onClick={() => setSelectedImage(null)}
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                    
                    {selectedImage && (
                        <img 
                            src={`/storage/${selectedImage}`} 
                            alt="Lampiran Full" 
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
