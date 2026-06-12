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
        abort_if(!$user->isMax(), 403);
        abort_if(!$workspace->members->contains($user) && $workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $workspace->tasks()->create([
            'title' => $validated['title'],
            'status' => 'todo',
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan.');
    }

    public function updateStatus(Request $request, WorkspaceTask $workspaceTask)
    {
        $user = $request->user();
        $workspace = $workspaceTask->workspace;

        abort_if(!$user->isMax(), 403);
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
