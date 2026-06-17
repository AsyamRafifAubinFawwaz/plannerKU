<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WorkspaceTask;
use App\Models\WorkspaceTaskChecklist;

class WorkspaceTaskChecklistController extends Controller
{
    public function store(Request $request, WorkspaceTask $task)
    {
        $user = $request->user();
        abort_if(!$task->workspace->members->contains($user) && $task->workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task->checklists()->create([
            'title' => $validated['title'],
            'is_done' => false,
        ]);

        return back();
    }

    public function update(Request $request, WorkspaceTaskChecklist $checklist)
    {
        $user = $request->user();
        $task = $checklist->task;
        abort_if(!$task->workspace->members->contains($user) && $task->workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'is_done' => 'required|boolean',
        ]);

        $checklist->update(['is_done' => $validated['is_done']]);

        return back();
    }

    public function destroy(Request $request, WorkspaceTaskChecklist $checklist)
    {
        $user = $request->user();
        $task = $checklist->task;
        abort_if(!$task->workspace->members->contains($user) && $task->workspace->owner_id !== $user->id, 403);

        $checklist->delete();

        return back();
    }
}
