import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import { SiFireship } from "react-icons/si";
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
    last7Days: string[];
    onEdit: (habit: Habit) => void;
    onDelete: (habit: Habit) => void;
    onToggle?: (habitId: number, date: string) => void;
}

export function HabitRow({ habit, last7Days, onEdit, onDelete, onToggle }: Props) {
    const todayStr = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const doneToday = habit.logs.some(l => l.logged_date.split('T')[0] === todayStr);

    const isDone = (date: string) =>
        habit.logs.some((log) => log.logged_date.split('T')[0] === date);

    function toggle(date: string) {
        if (onToggle) {
            onToggle(habit.id, date);
        } else {
            router.post(`/habits/${habit.id}/toggle`, { date }, {
                preserveScroll: true,
            });
        }
    }

    return (
        <div className="flex items-center justify-between">
            {/* Nama + Icon + Streak */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-[15px] font-bold transition-all duration-200 ${doneToday ? 'line-through text-text-muted' : 'text-foreground'}`}>
                        {habit.name} {habit.icon && <span>{habit.icon}</span>}
                    </p>
                    {habit.current_streak > 0 && (
                        <span className="text-[11px] text-primary font-bold flex items-center gap-1">
                            <SiFireship className="mb-1" size={15}/> {habit.current_streak}
                        </span>
                    )}
                </div>
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
