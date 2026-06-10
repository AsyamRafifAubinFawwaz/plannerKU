import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EventFormModal } from '@/components/event/event-form-modal';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Event {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    color: string | null;
    notes: string | null;
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

                {/* Subheader Bulan & Tahun */}
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-[17px] font-medium text-foreground">
                        {MONTHS[month]} {year}
                    </h2>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-muted-foreground hover:bg-[#1E1E1E]" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-muted-foreground hover:bg-[#1E1E1E]" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Kalender Grid */}
                <div className="w-full">
                    {/* Header Hari */}
                    <div className="grid grid-cols-7 gap-3 mb-2">
                        {DAYS.map((d) => (
                            <div key={d} className="text-[13px] text-muted-foreground font-medium pl-3">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Kotak Tanggal */}
                    {/* Gap diatur menjadi 3, dan col-span proporsional */}
                    <div className="grid grid-cols-7 gap-3">
                        {calendarDays.map((day, idx) => {
                            const dayEvents = day ? getEventsForDay(day) : [];
                            const currentDay = day ? isToday(day) : false;

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[100px] md:min-h-[120px] rounded-xl p-3 border transition-colors flex flex-col ${
                                        !day 
                                            ? 'bg-transparent border-transparent' 
                                            : currentDay 
                                                ? 'bg-[#FF6B1A] border-[#FF6B1A]' 
                                                : 'bg-[#141414] border-[#2A2A2A] hover:border-[#444]'
                                    }`}
                                >
                                    {day && (
                                        <>
                                            {/* Angka Tanggal */}
                                            <span className={`text-[15px] ${currentDay ? 'text-white font-medium' : 'text-foreground'}`}>
                                                {day}
                                            </span>

                                            {/* Dot event */}
                                            <div className="mt-auto flex flex-wrap gap-1.5">
                                                {dayEvents.map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: currentDay ? '#fff' : (event.color ?? '#FF6B1A') }}
                                                        title={event.title}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Event Mendatang List */}
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
                                            <button className="p-1 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => { setEventToEdit(event); setFormOpen(true); }}>
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="p-1 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => setEventToDelete(event)}>
                                                <Trash2Icon className="h-3.5 w-3.5" />
                                            </button>
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