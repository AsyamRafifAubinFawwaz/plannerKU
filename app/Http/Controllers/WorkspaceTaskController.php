<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Models\WorkspaceTask;
use Illuminate\Http\Request;

class WorkspaceTaskController extends Controller
{
    public function store(Request $request, Workspace $workspace)
    {
        $user = $request->user();
        abort_if(!$workspace->members->contains($user) && $workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|max:5120', // Max 5MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('workspace-tasks', 'public');
        }

        $workspace->tasks()->create([
            'title' => $validated['title'],
            'status' => 'todo',
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan.');
    }

    public function updateStatus(Request $request, WorkspaceTask $workspaceTask)
    {
        $user = $request->user();
        $workspace = $workspaceTask->workspace;

        abort_if(!$workspace->members->contains($user) && $workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'status' => 'required|in:todo,doing,done',
        ]);

        $workspaceTask->update([
            'status' => $validated['status'],
        ]);

        return back();
    }
}
