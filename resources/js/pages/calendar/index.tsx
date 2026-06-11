import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EventFormModal } from '@/components/event/event-form-modal';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2 } from 'react-icons/fi';
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

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function CalendarIndex({ events }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [formOpen, setFormOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [deleting, setDeleting] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let firstDayOfMonth = new Date(year, month, 1).getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays: (number | null)[] = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    function prevMonth() {
        setCurrentDate(new Date(year, month - 1, 1));
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month + 1, 1));
    }

    function getEventsForDay(day: number): Event[] {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter((e) => {
            const start = e.start_date.split('T')[0];
            const end = e.end_date.split('T')[0];
            return start <= dateStr && dateStr <= end;
        });
    }

    function isToday(day: number): boolean {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    }

    function confirmDelete() {
        if (!eventToDelete) return;
        setDeleting(true);
        router.delete(`/events/${eventToDelete.id}`, {
            onSuccess: () => {
                toast.success('Event berhasil dihapus!');
                setEventToDelete(null);
            },
            onError: () => toast.error('Gagal menghapus event.'),
            onFinish: () => setDeleting(false),
        });
    }

    const upcomingEvents = events.filter(e => {
        const end = new Date(e.end_date.split('T')[0]);
        const today = new Date();
        today.setHours(0,0,0,0);
        return end >= today;
    }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    function formatDateList(dateStr: string) {
        const d = new Date(dateStr.split('T')[0]);
        const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()];
        return `${dayName}, ${d.getDate()} ${MONTHS[d.getMonth()].substring(0, 3)}`;
    }

    return (
        <>
            <Head title="Kalender" />

            {/* w-full dan max-w-7xl agar grid bisa melebar maksimal seperti di Figma */}
            <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-[22px] font-medium text-foreground">Kalender</h1>
                    <Button className="bg-[#FF6B1A] hover:bg-[#FF8C42] text-white cursor-pointer rounded-lg px-4" onClick={() => setFormOpen(true)}>
                        + Tambah event
                    </Button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9 bg-transparent border-[#2A2A2A] text-foreground hover:bg-[#2A2A2A] cursor-pointer">
                            <FiChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-medium text-foreground min-w-[140px] text-center">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9 bg-transparent border-[#2A2A2A] text-foreground hover:bg-[#2A2A2A] cursor-pointer">
                            <FiChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-7 gap-3 mb-2">
                        {DAYS.map((d) => (
                            <div key={d} className="text-[13px] text-muted-foreground font-medium pl-3">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-3">
                        {calendarDays.map((day, idx) => {
                            const dayEvents = day ? getEventsForDay(day) : [];
                            const currentDay = day ? isToday(day) : false;

                            return (
                                <div
                                    key={idx}
                                    className={`relative min-h-[100px] md:min-h-[120px] rounded-2xl p-3 border-2 transition-transform hover:-translate-y-[2px] active:translate-y-0 flex flex-col group overflow-hidden ${
                                        !day 
                                            ? 'bg-transparent border-transparent' 
                                            : currentDay 
                                                ? 'bg-[#1A1A1A] border-[#FF6B1A]/50 border-b-4 hover:border-[#FF6B1A]' 
                                                : 'bg-[#1A1A1A] border-[#2A2A2A] border-b-4 hover:border-[#444]'
                                    }`}
                                >
                                    {day && (
                                        <div className="flex flex-col h-full relative">
                                            
                                            {/* Baris Atas: Tanggal (kiri) & Titik Warna (kanan) */}
                                            <div className="flex justify-between items-start mb-2.5">
                                                <span className={`text-[16px] font-black leading-none ${currentDay ? 'text-[#FF6B1A]' : 'text-muted-foreground'}`}>
                                                    {day}
                                                </span>

                                                {dayEvents.length > 0 && (
                                                    <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
                                                        {dayEvents.map(event => (
                                                            <div 
                                                                key={event.id}
                                                                className="w-2.5 h-2.5 rounded-full"
                                                                style={{ backgroundColor: event.color ?? '#FF6B1A' }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Daftar Event di bawah tanggal */}
                                            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                                                {dayEvents.map(event => (
                                                    <div 
                                                        key={event.id}
                                                        className="flex flex-col cursor-pointer transition-opacity hover:opacity-80 relative pl-2 border-l-[3px]"
                                                        style={{ borderColor: event.color ?? '#FF6B1A' }}
                                                        onClick={(e) => { e.stopPropagation(); setEventToEdit(event); setFormOpen(true); }}
                                                    >
                                                        <span className={`text-[13px] font-bold truncate leading-tight flex items-center gap-1 ${event.is_done ? 'text-muted-foreground line-through' : 'text-white'}`}>
                                                            {event.is_done && <span className="text-emerald-500">✓</span>}
                                                            {event.title}
                                                        </span>
                                                        {event.notes && (
                                                            <span className="text-[11px] font-medium text-muted-foreground truncate leading-tight mt-0.5">
                                                                {event.notes}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-8">
                    <h3 className="text-[15px] font-medium text-muted-foreground mb-4">Event mendatang</h3>
                    <div className="space-y-3">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground bg-[#141414] rounded-xl p-4 border border-[#2A2A2A]">Tidak ada event mendatang.</p>
                        ) : (
                            upcomingEvents.map((event) => (
                                <div key={event.id} className="group flex items-center justify-between rounded-xl bg-[#141414] border border-[#2A2A2A] p-4 transition-colors hover:bg-[#1A1A1A]">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="h-2.5 w-2.5 rounded-full" 
                                            style={{ backgroundColor: event.color ?? '#FF6B1A' }} 
                                        />
                                        <span className="text-[14px] font-medium text-foreground">{event.title}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <span className="text-[13px] text-muted-foreground">
                                            {formatDateList(event.start_date)}
                                        </span>
                                        
                                        <div className="hidden group-hover:flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => { setEventToEdit(event); setFormOpen(true); }}>
                                                <FiEdit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => setEventToDelete(event)}>
                                                <FiTrash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <EventFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEventToEdit(null); }}
                event={eventToEdit ?? undefined}
            />

            <ConfirmDialog
                open={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={confirmDelete}
                title="Hapus event ini?"
                description={`"${eventToDelete?.title}" akan dihapus permanen.`}
                loading={deleting}
            />
        </>
    );
}