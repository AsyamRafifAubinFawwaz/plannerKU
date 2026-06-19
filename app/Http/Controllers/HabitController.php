<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHabitRequest;
use App\Http\Requests\UpdateHabitRequest;
use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HabitController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $habits = $user->habits()
            ->with(['logs' => fn($q) => $q->orderBy('logged_date', 'desc')->limit(30)])
            ->get();

        $proofPhotos = HabitLog::where('user_id', $user->id)
            ->whereNotNull('photo_path')
            ->with('habit:id,name')
            ->orderBy('logged_date', 'desc')
            ->limit(24)
            ->get(['id', 'habit_id', 'logged_date', 'photo_path', 'caption']);

        return Inertia::render('habit/index', [
            'habits'      => $habits,
            'points'      => $user->points ?? 0,
            'proofPhotos' => $proofPhotos,
        ]);
    }

  
    public function store(StoreHabitRequest $request)
    {
        auth()->user()->habits()->create($request->validated());
        return back()->with('success', 'Habit berhasil ditambahkan!');
    }

    public function update(UpdateHabitRequest $request, Habit $habit)
    {
        $this->authorize('update', $habit);
        $data = $request->validated();
        $habit->update($data);
        return back()->with('success', 'Habit berhasil diperbarui');
    }

    public function destroy(Habit $habit)
    {
        $this->authorize('delete', $habit);
        $habit->delete();
        return back()->with('success', 'Tugas berhasil di hapus');
    }
}
