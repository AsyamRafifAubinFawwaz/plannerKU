import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EventFormModal } from '@/components/event/event-form-modal';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { Head, router, usePage } from '@inertiajs/react';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'sonner';

interface Event {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    color: string | null;
    notes: string | null;
    is_done: boolean;
}

interface Props {
    events: Event[];
}

const DAYS   = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function CalendarIndex({ events }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [formOpen, setFormOpen]         = useState(false);
    const [eventToEdit, setEventToEdit]   = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [deleting, setDeleting]         = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    // Pre-fill tanggal saat klik kotak kosong
    const [prefillDate, setPrefillDate]   = useState<string | undefined>(undefined);

    const { auth } = usePage().props as any;
    const canAddEvent = auth?.limits?.canAddEvent ?? true;

    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Hari pertama bulan ini (0=Sun → ubah ke 0=Mon)
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Tampilkan juga hari dari bulan sebelumnya (untuk padding)
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Selalu 6 baris × 7 kolom = 42 cell agar tinggi konsisten
    const totalCells = 42;
    const cells: { day: number; inMonth: boolean }[] = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push({ day: prevMonthDays - firstDay + 1 + i, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, inMonth: true });
    }
    while (cells.length < totalCells) {
        cells.push({ day: cells.length - firstDay - daysInMonth + 1, inMonth: false });
    }

    function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); }
    function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); }

    function goToday() { setCurrentDate(new Date()); }

    function getEventsForDay(day: number): Event[] {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => {
            const start = e.start_date.split('T')[0];
            const end   = e.end_date.split('T')[0];
            return start <= dateStr && dateStr <= end;
        });
    }

    function isToday(day: number): boolean {
        const t = new Date();
        return t.getDate() === day && t.getMonth() === month && t.getFullYear() === year;
    }

    function openCreateForDay(day: number) {
        if (!canAddEvent) { setUpgradeModalOpen(true); return; }
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setPrefillDate(dateStr);
        setEventToEdit(null);
        setFormOpen(true);
    }

    function openEditEvent(event: Event) {
        setEventToEdit(event);
        setPrefillDate(undefined);
        setFormOpen(true);
    }

    function openCreateBlank() {
        if (!canAddEvent) { setUpgradeModalOpen(true); return; }
        setPrefillDate(undefined);
        setEventToEdit(null);
        setFormOpen(true);
    }

    function confirmDelete() {
        if (!eventToDelete) return;
        setDeleting(true);
        router.delete(`/events/${eventToDelete.id}`, {
            onSuccess: () => { toast.success('Event berhasil dihapus!'); setEventToDelete(null); },
            onError: () => toast.error('Gagal menghapus event.'),
            onFinish: () => setDeleting(false),
        });
    }

    return (
        <>
            <Head title="Kalender" />

            {/* Satu layar penuh — tidak scroll vertikal */}
            <div className="flex flex-col h-[calc(100vh-64px)] px-6 py-4 w-full max-w-7xl mx-auto">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-white">Kalender</h1>
                        {/* Nav bulan */}
                        <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-1 py-0.5">
                            <button onClick={prevMonth} className="p-1.5 rounded hover:bg-[#2A2A2A] text-text-muted hover:text-white transition-colors">
                                <FiChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-semibold text-white px-2 min-w-[130px] text-center">
                                {MONTHS[month]} {year}
                            </span>
                            <button onClick={nextMonth} className="p-1.5 rounded hover:bg-[#2A2A2A] text-text-muted hover:text-white transition-colors">
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                        <button onClick={goToday} className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors">
                            Hari Ini
                        </button>
                    </div>
                    <button
                        onClick={openCreateBlank}
                        className="bg-primary border-b-4 border-b-[#C4500D] text-white px-4 py-1.5 rounded-lg font-semibold flex items-center gap-2 text-sm transition-all active:translate-y-[2px] active:border-b-[1px]"
                    >
                        <FiPlus /> Tambah Event
                    </button>
                </div>

                {/* ── Grid Kalender ── */}
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Header hari */}
                    <div className="grid grid-cols-7 mb-1 flex-shrink-0">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-[11px] font-bold text-text-muted uppercase tracking-wider py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* 6 × 7 grid — flex-1 untuk isi sisa tinggi */}
                    <div className="grid grid-cols-7 grid-rows-6 flex-1 gap-1 min-h-0">
                        {cells.map((cell, idx) => {
                            const dayEvents = cell.inMonth ? getEventsForDay(cell.day) : [];
                            const today     = cell.inMonth && isToday(cell.day);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => cell.inMonth && openCreateForDay(cell.day)}
                                    className={`relative flex flex-col rounded-xl border overflow-hidden cursor-pointer transition-colors group
                                        ${!cell.inMonth
                                            ? 'bg-[#0F0F0F] border-[#1A1A1A]'
                                            : today
                                                ? 'bg-[#1A1A1A] border-primary/60 hover:border-primary'
                                                : 'bg-[#141414] border-[#2A2A2A] hover:border-[#444]'
                                        }`}
                                >
                                    {/* Nomor tanggal */}
                                    <div className="flex items-center justify-between px-2 pt-1.5 flex-shrink-0">
                                        <span className={`text-xs font-bold leading-none ${
                                            !cell.inMonth ? 'text-text-faint' :
                                            today ? 'text-white bg-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px]' :
                                            'text-text-muted'
                                        }`}>
                                            {cell.day}
                                        </span>
                                        {/* Dots event di kanan atas */}
                                        {dayEvents.length > 0 && (
                                            <div className="flex gap-0.5 flex-wrap justify-end max-w-[50%]">
                                                {dayEvents.slice(0, 3).map(e => (
                                                    <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color ?? '#FF6B1A' }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Event list */}
                                    <div className="flex-1 overflow-hidden px-1 pb-1 space-y-0.5 mt-1">
                                        {dayEvents.slice(0, 3).map(event => (
                                            <div
                                                key={event.id}
                                                onClick={e => { e.stopPropagation(); openEditEvent(event); }}
                                                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer hover:opacity-80 transition-opacity truncate"
                                                style={{
                                                    borderLeft: `2px solid ${event.color ?? '#FF6B1A'}`,
                                                    backgroundColor: (event.color ?? '#FF6B1A') + '18',
                                                    color: event.is_done ? '#555' : '#ccc',
                                                    textDecoration: event.is_done ? 'line-through' : 'none',
                                                }}
                                            >
                                                {event.is_done && <span style={{ color: '#1D9E75' }}>✓</span>}
                                                <span className="truncate">{event.title}</span>
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <p className="text-[9px] text-text-muted px-1.5">+{dayEvents.length - 3} lagi</p>
                                        )}
                                    </div>

                                    {/* Hint tambah saat hover di hari kosong */}
                                    {cell.inMonth && dayEvents.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiPlus className="text-text-muted" size={16} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <EventFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEventToEdit(null); setPrefillDate(undefined); }}
                event={eventToEdit ?? undefined}
                prefillDate={prefillDate}
            />

            <ConfirmDialog
                open={!!eventToDelete} onClose={() => setEventToDelete(null)} onConfirm={confirmDelete}
                title="Hapus event ini?"
                description={`"${eventToDelete?.title}" akan dihapus permanen.`}
                loading={deleting}
            />

            <UpgradeModal
                open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)}
                title="Limit Kalender Tercapai"
                description="Kamu telah mencapai batas maksimal 10 event di paket Gratis. Upgrade untuk event tak terbatas!"
            />
        </>
    );
}