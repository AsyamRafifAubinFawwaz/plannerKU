import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { FiCheckCircle } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa6';

interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function UpgradeModal({ open, onClose, title = "Limit Fitur Gratis Tercapai", description = "Kamu telah mencapai batas maksimal untuk fitur ini di paket Gratis." }: UpgradeModalProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[450px] bg-surface border border-border border-b-[6px] border-b-[#0A0A0A] rounded-3xl p-0 overflow-hidden">
                <div className="bg-primary/10 p-6 flex items-center justify-center border-b border-border">
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center border-b-4 border-b-[#C4500D] shadow-xl shadow-primary/20">
                        <FaFire size={32} />
                    </div>
                </div>
                
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-extrabold text-white text-center">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-center text-text-muted mt-2 font-medium">
                            {description} Upgrade ke <strong>Pro</strong> untuk membuka akses tanpa batas dan maksimalkan produktivitasmu!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 mb-8 bg-bg p-4 rounded-xl border border-border">
                        <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Keuntungan Pro:</h4>
                        <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                            <FiCheckCircle className="text-primary flex-shrink-0" size={18} />
                            <span>Tugas, Habit, & Event tak terbatas</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                            <FiCheckCircle className="text-primary flex-shrink-0" size={18} />
                            <span>Lampiran 3 foto (5MB) per tugas</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                            <FiCheckCircle className="text-primary flex-shrink-0" size={18} />
                            <span>Notifikasi WhatsApp harian otomatis</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/pricing"
                            className="w-full bg-primary text-white font-bold text-center py-3.5 rounded-xl border-b-4 border-b-[#C4500D] active:translate-y-[2px] active:border-b-[2px] transition-all text-lg"
                        >
                            Upgrade ke Pro
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-full bg-transparent text-text-muted font-bold text-center py-3 rounded-xl hover:bg-card hover:text-white transition-colors"
                        >
                            Mungkin Nanti
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
