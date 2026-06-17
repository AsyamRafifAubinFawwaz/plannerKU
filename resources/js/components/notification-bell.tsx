import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { FiBell, FiCheck, FiX, FiUsers } from 'react-icons/fi';

export function NotificationBell() {
    const { auth, pendingInvitations: initialInvitations } = usePage().props as any;
    const [invitations, setInvitations] = useState<any[]>(initialInvitations || []);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Sync saat ada navigasi Inertia (props berubah)
    useEffect(() => {
        setInvitations(initialInvitations || []);
    }, [initialInvitations]);

    // Listen real-time invitation via Reverb
    useEffect(() => {
        if (!auth?.user?.id || !(window as any).Echo) return;

        const channel = (window as any).Echo.private(`user.${auth.user.id}`)
            .listen('InvitationReceived', (e: any) => {
                setInvitations(prev => [e.invitation, ...prev]);
                // Buka bell otomatis saat ada undangan baru
                setOpen(true);
            });

        return () => {
            channel.stopListening('InvitationReceived');
        };
    }, [auth?.user?.id]);

    // Tutup panel saat klik di luar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const accept = (invitation: any) => {
        router.post(`/invitations/${invitation.id}/accept`, {}, {
            onSuccess: () => {
                setInvitations(prev => prev.filter(i => i.id !== invitation.id));
                setOpen(false);
            },
        });
    };

    const decline = (invitation: any) => {
        router.post(`/invitations/${invitation.id}/decline`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setInvitations(prev => prev.filter(i => i.id !== invitation.id));
            },
        });
    };

    const count = invitations.length;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-lg text-text-muted hover:text-white hover:bg-card transition-colors"
                title="Notifikasi"
            >
                <FiBell size={20} />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <FiBell className="text-primary" /> Notifikasi
                        </h3>
                        {count > 0 && (
                            <span className="bg-danger text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                                {count} baru
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {count === 0 ? (
                            <div className="p-8 text-center text-text-muted">
                                <FiBell size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Tidak ada notifikasi baru</p>
                            </div>
                        ) : (
                            invitations.map((inv: any) => (
                                <div key={inv.id} className="p-4 border-b border-border/50 hover:bg-card/50 transition-colors">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                            <FiUsers className="text-primary" size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium leading-snug">
                                                <span className="text-primary">{inv.invited_by?.name || 'Seseorang'}</span> mengundangmu ke workspace
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5 font-semibold truncate">
                                                🏢 {inv.workspace?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pl-12">
                                        <button
                                            onClick={() => accept(inv)}
                                            className="flex-1 bg-primary hover:bg-[#FF8C42] text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <FiCheck size={12} /> Terima
                                        </button>
                                        <button
                                            onClick={() => decline(inv)}
                                            className="flex-1 bg-card hover:bg-[#2A2A2A] border border-border text-text-muted hover:text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <FiX size={12} /> Tolak
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
