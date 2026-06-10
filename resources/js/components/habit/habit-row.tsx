import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Pencil, Trash2Icon } from 'lucide-react';

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
        <div className="flex items-center justify-between rounded-xl bg-[#1A1A1A] px-4 py-4 transition-colors hover:bg-[#222]">
            {/* Nama + Icon */}
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-foreground">
                    {habit.name} {habit.icon && <span>{habit.icon}</span>}
                </p>
            </div>

            <div className="flex items-center gap-6">
                {/* Dot Tracker 7 hari */}
                <div className="flex gap-1.5">
                    {last7Days.map((date) => (
                        <div key={date} className="w-8 flex justify-center">
                            <button
                                onClick={() => toggle(date)}
                                className="transition-transform hover:scale-110 flex-shrink-0"
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    background: isDone(date) ? '#FF6B1A' : '#2A2A2A',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Tombol Edit & Hapus */}
                <div className="flex items-center justify-end gap-1 opacity-50 transition-opacity hover:opacity-100 w-14">
                    <button
                        className="p-1 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(habit)}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        className="p-1 cursor-pointer text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(habit)}
                        title="Hapus"
                    >
                        <Trash2Icon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
