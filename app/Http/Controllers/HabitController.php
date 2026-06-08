<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHabitRequest;
use App\Http\Requests\UpdateHabitRequest;
use App\Models\Habit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HabitController extends Controller
{
    public function index(): Response
    {
        $habits = auth()->user()->habits()->get();
        return Inertia::render('habits/index', [
            'habits' => $habits
        ]);
    }

    public function create()
    {
        // return inertia('habits/create');
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
