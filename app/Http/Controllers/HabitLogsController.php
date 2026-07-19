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
            // Uncheck — hapus foto jika ada, kurangi poin, dll.
            if ($log->photo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($log->photo_path);
            }
            $log->delete();
            $user->decrement('points', self::POINTS_PER_CHECK);
            
            // Perlu mengurangi bonus streak jika tepat pada kelipatan 7 yang dihapus?
            // Demi kesederhanaan MVP, kita kurangi base points saja.
            
            $streakService->recalculate($habit);
            $habit->refresh();
            
            return back()->with('success', 'Habit dibatalkan pada tanggal ini.');
        }

        return back()->withErrors(['error' => 'Harus mengupload foto untuk menyelesaikan habit.']);
    }

    /** Upload bukti foto sekaligus menyelesaikan habit */
    public function uploadProof(Request $request, Habit $habit, HabitStreakService $streakService)
    {
        $this->authorize('update', $habit);

        $request->validate([
            'photo'   => 'required|image|max:5120', // 5MB
            'caption' => 'nullable|string|max:255',
            'date'    => 'required|date',
        ]);

        $date = $request->input('date');
        $user = auth()->user();

        // Cek apakah sudah ada log di tanggal ini
        $log = $habit->logs()->where('logged_date', $date)->first();
        if ($log) {
            return back()->withErrors(['photo' => 'Habit sudah diselesaikan pada tanggal ini.']);
        }

        $path = $request->file('photo')->store('habit-proofs', 'public');

        HabitLog::create([
            'habit_id'    => $habit->id,
            'user_id'     => $user->id,
            'logged_date' => $date,
            'photo_path'  => $path,
            'caption'     => $request->input('caption'),
        ]);

        // Tambah poin
        $user->increment('points', self::POINTS_PER_CHECK);
        $pesan = '+' . self::POINTS_PER_CHECK . ' poin! Habit berhasil dikerjakan!';

        $streakService->recalculate($habit);
        $habit->refresh();

        // Cek bonus streak tiap 7 hari
        if ($habit->current_streak > 0 && $habit->current_streak % 7 === 0) {
            $user->increment('points', self::POINTS_STREAK_BONUS);
            $pesan .= ' 🎉 Bonus +' . self::POINTS_STREAK_BONUS . ' poin (streak ' . $habit->current_streak . ' hari)!';
        }

        return back()->with('success', $pesan . ' 📸');
    }
}
