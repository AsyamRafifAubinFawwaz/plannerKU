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
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-accent">
            {/* Icon + Nama */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                    {habit.icon && <span className="mr-2">{habit.icon}</span>}
                    {habit.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Target: {habit.target_per_week}x/minggu
                </p>
            </div>

            {/* Dot Tracker 7 hari */}
            <div className="flex gap-1.5">
                {last7Days.map((date) => (
                    <button
                        key={date}
                        onClick={() => toggle(date)}
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: isDone(date) ? '#FF6B1A' : '#2a2a2a',
                            border: isDone(date) ? 'none' : '1px solid #3a3a3a',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>

            {/* Streak */}
            <span className="flex-shrink-0 text-xs font-medium text-primary">
                🔥 {habit.current_streak}
            </span>

            {/* Tombol Edit & Hapus */}
            <div className="flex flex-shrink-0 gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => onEdit(habit)}
                    title="Edit"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-destructive hover:text-destructive"
                    onClick={() => onDelete(habit)}
                    title="Hapus"
                >
                    <Trash2Icon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
