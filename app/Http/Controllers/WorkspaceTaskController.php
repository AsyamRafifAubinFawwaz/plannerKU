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
            'column_id' => 'required|exists:workspace_columns,id',
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('workspace-tasks', 'public');
        }

        $order = $workspace->tasks()->where('column_id', $validated['column_id'])->max('order') ?? 0;

        $workspace->tasks()->create([
            'column_id' => $validated['column_id'],
            'title' => $validated['title'],
            'cover_image' => $imagePath,
            'order' => $order + 1,
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan.');
    }

    public function updateStatus(Request $request, WorkspaceTask $task)
    {
        $user = $request->user();
        $workspace = $task->workspace;

        abort_if(!$workspace->members->contains($user) && $workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'column_id' => 'required|exists:workspace_columns,id',
            'order' => 'required|integer',
        ]);

        $task->update([
            'column_id' => $validated['column_id'],
            'order' => $validated['order'],
        ]);

        return back();
    }

    public function update(Request $request, WorkspaceTask $task)
    {
        $user = $request->user();
        abort_if(!$task->workspace->members->contains($user) && $task->workspace->owner_id !== $user->id, 403);

        $validated = $request->validate([
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'labels' => 'nullable|array',
            'assigned_to' => 'nullable|array',
            'assigned_to.*' => 'exists:users,id',
        ]);

        $task->update([
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'labels' => $validated['labels'] ?? [],
        ]);

        if (isset($validated['assigned_to'])) {
            $task->members()->sync($validated['assigned_to']);
        }

        return back();
    }

    public function storeAttachment(Request $request, WorkspaceTask $task)
    {
        $user = $request->user();
        abort_if(!$task->workspace->members->contains($user) && $task->workspace->owner_id !== $user->id, 403);

        $request->validate([
            'attachment' => 'required|file|max:10240', // 10MB
        ]);

        $file = $request->file('attachment');
        $path = $file->store('workspace-tasks/attachments', 'public');
        
        $attachments = $task->attachments ?? [];
        $attachments[] = [
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ];

        $task->update(['attachments' => $attachments]);

        return back();
    }

    public function destroyAttachment(Request $request, WorkspaceTask $task, $index)
    {
        $user = $request->user();
        abort_if(!$task->workspace->members->contains($user) && $task->workspace->owner_id !== $user->id, 403);

        $attachments = $task->attachments ?? [];
        if (isset($attachments[$index])) {
            $path = $attachments[$index]['path'];
            \Illuminate\Support\Facades\Storage::disk('public')->delete($path);
            array_splice($attachments, $index, 1);
            $task->update(['attachments' => $attachments]);
        }

        return back();
    }

    public function updateOrder(Request $request, Workspace $workspace)
    {
        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:workspace_tasks,id',
            'tasks.*.column_id' => 'required|exists:workspace_columns,id',
            'tasks.*.order' => 'required|integer',
        ]);

        foreach ($request->tasks as $taskData) {
            WorkspaceTask::where('id', $taskData['id'])->update([
                'column_id' => $taskData['column_id'],
                'order' => $taskData['order'],
            ]);
        }

        $workspace->load(['columns.tasks.members', 'columns.tasks.checklists']);
        broadcast(new \App\Events\WorkspaceUpdated($workspace->id, $workspace->columns))->toOthers();

        return back();
    }
}
