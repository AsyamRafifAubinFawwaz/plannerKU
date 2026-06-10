<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Habit;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // 1. Tasks
        // Ambil tugas yang belum selesai atau selesai hari ini
        $tasks = Task::where('user_id', $user->id)
            ->where(function($query) use ($today) {
                $query->where('is_done', false)
                      ->orWhereDate('done_at', $today);
            })
            ->orderBy('is_done', 'asc')
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get();

        $tasksCount = Task::where('user_id', $user->id)
            ->where('is_done', false)
            ->count();

        // 2. Habits
        $habits = Habit::with(['logs' => function($query) {
                $query->where('logged_date', '>=', Carbon::now()->subDays(6)->startOfDay());
            }])
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->get();

        $highestStreak = $habits->max('current_streak') ?? 0;

        // Hitung persentase habit yang selesai minggu ini (7 hari terakhir)
        $totalPossibleHabits = $habits->count() * 7;
        $totalDoneHabits = 0;
        foreach ($habits as $habit) {
            $totalDoneHabits += $habit->logs->count();
        }
        $habitProgressPercent = $totalPossibleHabits > 0 
            ? round(($totalDoneHabits / $totalPossibleHabits) * 100) 
            : 0;

        // 3. Events
        $eventsCount = Event::where('user_id', $user->id)
            ->where('start_date', '<=', $endOfWeek)
            ->where('end_date', '>=', $startOfWeek)
            ->count();

        return Inertia::render('dashboard', [
            'tasksCount' => $tasksCount,
            'highestStreak' => $highestStreak,
            'eventsCount' => $eventsCount,
            'tasks' => $tasks,
            'habits' => $habits,
            'habitProgressPercent' => $habitProgressPercent,
        ]);
    }
}
