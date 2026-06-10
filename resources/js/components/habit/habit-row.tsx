import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

interface Habit {
    id: number;
    name: string;
    icon: string | null;
    target_per_week: number;
    current_streak: number;
    is_active: boolean;
    logs: { logged_date: string }[];
}

interface Props {
    habit: Habit;
    onEdit: (habit: Habit) => void;
    onDelete: (habit: Habit) => void;
}

const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
});

export function HabitRow({ habit, onEdit, onDelete }: Props) {
    const isDone = (date: string) =>
        habit.logs.some((log) => log.logged_date.split('T')[0] === date);

    function toggle(date: string) {
        router.post(`/habits/${habit.id}/toggle`, { date }, {
            preserveScroll: true,
        });
    }

    return (
        <div className="flex items-center justify-between rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4 px-5 py-4 transition-transform hover:-translate-y-[2px] hover:border-[#444] active:translate-y-0 active:border-b-2">
            {/* Nama + Icon */}
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground">
                    {habit.name} {habit.icon && <span>{habit.icon}</span>}
                </p>
            </div>

            <div className="flex items-center gap-6">
                {/* Dot Tracker 7 hari */}
                <div className="flex gap-1.5">
                    {last7Days.map((date) => (
                        <div key={date} className="w-8 flex justify-center items-center">
                            <button
                                onClick={() => toggle(date)}
                                className={`relative flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                    isDone(date) 
                                        ? 'bg-[#FF6B1A] border-[#D6540D] shadow-[0_3px_0_#D6540D] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none' 
                                        : 'bg-[#2A2A2A] border-[#1A1A1A] shadow-[0_3px_0_#1A1A1A] hover:bg-[#333] hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none'
                                }`}
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    borderWidth: '2px',
                                }}
                            >
                                <div className={`transition-all duration-300 ${isDone(date) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                    <FiCheck className="text-white w-3 h-3" strokeWidth={4} />
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Tombol Edit & Hapus */}
                <div className="flex items-center justify-end gap-1 opacity-50 transition-opacity hover:opacity-100 w-14">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-foreground rounded-md"
                        onClick={() => onEdit(habit)}
                        title="Edit"
                    >
                        <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        onClick={() => onDelete(habit)}
                        title="Hapus"
                    >
                        <FiTrash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
