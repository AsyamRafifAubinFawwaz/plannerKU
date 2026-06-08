<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Request;
use App\Services\HabitStreakService;

class HabitLogsController extends Controller
{
    public function toggle(Request $request, Habit $habit, HabitStreakService $streakService)
    {
        $this->authorize('update', $habit);
        $date = $request->input('date', today()->toDateString());

        $log = $habit->logs()->where('logged_date', $date)->first();

        if ($log) {
            $log->delete();
            $pesan = 'Habit tidak lagi dikerjakan pada tanggal ini.';
        } else {
            HabitLog::create([
                'habit_id' => $habit->id,
                'user_id' => auth()->id(),
                'logged_date' => $date,
            ]);
            $pesan = 'Habit berhasil dikerjakan!';
        }

        $streakService->recalculate($habit);

        return back()->with('success', $pesan);
    }
}
