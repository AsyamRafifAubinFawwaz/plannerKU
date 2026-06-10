import { Head, router } from '@inertiajs/react';
import { FiCheck, FiCalendar, FiTarget } from 'react-icons/fi';
import { FaFire, FaTrophy, FaBolt } from "react-icons/fa6";
import { Checkbox } from '@/components/ui/checkbox';
import { usePage } from '@inertiajs/react';
import { BsRocketTakeoffFill } from "react-icons/bs";
interface Task {
    id: number;
    title: string;
    category: 'kuliah' | 'harian' | 'penting';
    due_date: string | null;
    is_done: boolean;
    done_at: string | null;
}

interface Habit {
    id: number;
    name: string;
    icon: string | null;
    logs: { logged_date: string }[];
}

interface DashboardProps {
    tasksCount: number;
    highestStreak: number;
    eventsCount: number;
    tasks: Task[];
    habits: Habit[];
    habitProgressPercent: number;
}

const categoryBadge: Record<string, { bg: string; text: string; label: string }> = {
    kuliah: { bg: '#1E1A3A', text: '#A89BE8', label: 'kuliah' },
    harian: { bg: 'transparent', text: '#888888', label: 'harian' }, 
    penting: { bg: '#FF6B1A1A', text: '#FF6B1A', label: 'penting' },
};

export default function Dashboard({
    tasksCount,
    highestStreak,
    eventsCount,
    tasks,
    habits,
    habitProgressPercent
}: DashboardProps) {
    const user = usePage().props.auth.user as { name: string };
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    function toggleTask(task: Task) {
        router.patch(`/tasks/${task.id}`, { is_done: !task.is_done }, { preserveScroll: true });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="p-8 w-full max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        Ayo mulai, {user.name.split(' ')[0]}! <BsRocketTakeoffFill className="text-[#FF6B1A]" />
                    </h1>
                    <p className="mt-2 text-[15px] font-medium text-muted-foreground">
                        Ini target harianmu. Mari selesaikan!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4 p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">Tugas Aktif</span>
                            <div className="bg-[#FF6B1A]/10 p-2 rounded-xl text-[#FF6B1A]">
                                <FiTarget className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-[40px] font-black text-[#FF6B1A] mt-2 leading-none">{tasksCount}</div>
                    </div>
                    
                    <div className="rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4 p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">Streak</span>
                            <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 animate-pulse">
                                <FaFire className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-[40px] font-black text-white mt-2 leading-none flex items-baseline gap-1">
                            {highestStreak} <span className="text-lg font-bold text-muted-foreground lowercase">hari</span>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-[#141414] border-2 border-[#2A2A2A] border-b-4 p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">Event</span>
                            <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                                <FiCalendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-[40px] font-black text-white mt-2 leading-none">{eventsCount}</div>
                    </div>
                </div>

                {/* Dua Kolom Utama */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Tugas hari ini */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <FaBolt className="text-yellow-500" /> Misi Hari Ini
                        </h2>
                        
                        <div className="space-y-3">
                            {tasks.length === 0 ? (
                                <div className="text-center bg-[#141414] border-2 border-[#2A2A2A] border-b-4 rounded-2xl p-8">
                                    <p className="font-bold text-muted-foreground">Semua misi selesai! 🎉</p>
                                </div>
                            ) : (
                                tasks.map((task) => {
                                    const isDueToday = task.due_date === todayStr;
                                    const badge = categoryBadge[task.category];

                                    return (
                                        <div
                                            key={task.id}
                                            className={`flex items-center justify-between rounded-2xl bg-[#141414] border-2 px-5 py-4 cursor-pointer transition-all active:translate-y-[2px] active:border-b-2 ${
                                                task.is_done 
                                                    ? 'border-[#FF6B1A]/30 border-b-[#FF6B1A]/20 bg-[#FF6B1A]/5 opacity-80' 
                                                    : 'border-[#2A2A2A] border-b-4 hover:border-[#444]'
                                            }`}
                                            onClick={() => toggleTask(task)}
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <Checkbox 
                                                    checked={task.is_done}
                                                    onCheckedChange={() => toggleTask(task)}
                                                    className={`w-6 h-6 rounded-full border-2 transition-colors ${
                                                        task.is_done 
                                                            ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white data-[state=checked]:bg-[#FF6B1A] data-[state=checked]:border-[#FF6B1A]' 
                                                            : 'border-muted-foreground/40 hover:border-[#FF6B1A]'
                                                    }`}
                                                />

                                                <p
                                                    className={`text-[15px] truncate font-bold ${
                                                        task.is_done ? 'text-muted-foreground line-through' : 'text-foreground'
                                                    }`}
                                                >
                                                    {task.title}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                                {isDueToday && !task.is_done ? (
                                                    <span className="rounded-full px-3 py-1 text-[12px] font-bold border-2 border-[#E24B4A]/30 text-[#E24B4A] bg-[#E24B4A]/10">
                                                        HARI INI
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="rounded-full px-3 py-1 text-[12px] font-bold"
                                                        style={{
                                                            background: badge.bg,
                                                            color: badge.text,
                                                        }}
                                                    >
                                                        {badge.label.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Kebiasaan & Progress */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <FaTrophy className="text-[#FF6B1A]" /> Pencapaian Habit
                        </h2>

                        {/* Progress Card Terpadu */}
                        <div className="bg-[#141414] border-2 border-[#2A2A2A] border-b-4 rounded-3xl p-6">
                            
                            {/* Bar Progress Mingguan */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-muted-foreground text-sm uppercase tracking-wider">Progress Mingguan</span>
                                    <span className="font-black text-[#FF6B1A]">{habitProgressPercent}%</span>
                                </div>
                                <div className="h-5 w-full bg-[#2A2A2A] rounded-full overflow-hidden p-1">
                                    <div 
                                        className="h-full bg-[#FF6B1A] rounded-full transition-all duration-1000 relative"
                                        style={{ width: `${habitProgressPercent}%` }}
                                    >
                                        {/* Glossy highlight line */}
                                        <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/25 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Habit List Mini */}
                            <div className="space-y-4">
                                {habits.length === 0 ? (
                                    <p className="text-sm font-medium text-muted-foreground text-center">Belum ada habit yang berjalan.</p>
                                ) : (
                                    habits.map((habit) => (
                                        <div key={habit.id} className="flex flex-col gap-2">
                                            <span className="text-[14px] text-foreground font-bold flex items-center gap-2">
                                                {habit.icon && <span className="text-lg">{habit.icon}</span>}
                                                {habit.name}
                                            </span>
                                            
                                            <div className="flex justify-between items-center bg-[#1A1A1A] p-2 rounded-xl">
                                                {last7Days.map((date) => {
                                                    const isDone = habit.logs.some(log => log.logged_date.split('T')[0] === date);
                                                    return (
                                                        <div
                                                            key={date}
                                                            className={`h-4 w-4 rounded-full border-2 ${
                                                                isDone 
                                                                    ? 'bg-[#FF6B1A] border-[#FF6B1A]' 
                                                                    : 'bg-[#2A2A2A] border-[#2A2A2A]'
                                                            }`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
