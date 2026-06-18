<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Request;
use App\Services\HabitStreakService;

class HabitLogsController extends Controller
{
    // Konstanta poin
    const POINTS_PER_CHECK    = 10;
    const POINTS_STREAK_BONUS = 50; // bonus tiap 7 hari streak

    public function toggle(Request $request, Habit $habit, HabitStreakService $streakService)
    {
        $this->authorize('update', $habit);
        $date = $request->input('date', today()->toDateString());
        $user = auth()->user();

        $log = $habit->logs()->where('logged_date', $date)->first();

        if ($log) {
            // Uncheck — kurangi poin
            $log->delete();
            $user->decrement('points', self::POINTS_PER_CHECK);
            $pesan = 'Habit tidak lagi dikerjakan pada tanggal ini.';
        } else {
            HabitLog::create([
                'habit_id'    => $habit->id,
                'user_id'     => $user->id,
                'logged_date' => $date,
            ]);

            // Tambah poin
            $user->increment('points', self::POINTS_PER_CHECK);

            $pesan = '+' . self::POINTS_PER_CHECK . ' poin! Habit berhasil dikerjakan!';
        }

        $streakService->recalculate($habit);
        $habit->refresh();

        // Cek bonus streak tiap 7 hari
        if ($habit->current_streak > 0 && $habit->current_streak % 7 === 0) {
            $user->increment('points', self::POINTS_STREAK_BONUS);
            $pesan .= ' 🎉 Bonus +' . self::POINTS_STREAK_BONUS . ' poin (streak ' . $habit->current_streak . ' hari)!';
        }

        return back()->with('success', $pesan);
    }

    /** Upload bukti foto untuk habit log hari ini */
    public function uploadProof(Request $request, Habit $habit)
    {
        $this->authorize('update', $habit);

        $request->validate([
            'photo'   => 'required|image|max:5120', // 5MB
            'caption' => 'nullable|string|max:255',
        ]);

        $date = today()->toDateString();
        $log  = $habit->logs()->where('logged_date', $date)->first();

        if (!$log) {
            return back()->withErrors(['photo' => 'Centang habit dulu sebelum upload bukti.']);
        }

        $path = $request->file('photo')->store('habit-proofs', 'public');

        $log->update([
            'photo_path' => $path,
            'caption'    => $request->input('caption'),
        ]);

        return back()->with('success', 'Bukti kegiatan berhasil disimpan! 📸');
    }
}
