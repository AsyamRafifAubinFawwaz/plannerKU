<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Services\AttachmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(): Response
    {
        $tasks = auth()->user()->tasks()
            ->orderBy('is_done')
            ->orderBy('due_date')
            ->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    public function create() {}

    public function store(StoreTaskRequest $request, AttachmentService $attachmentService): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('attachments')) {
            $data['attachments'] = $attachmentService->uploadTaskPhotos(
                auth()->user(),
                $request->file('attachments')
            );
        }
        auth()->user()->tasks()->create($data);
        return back()->with('success', 'Tugas berhasil ditambahkan!');
    }

    public function update(UpdateTaskRequest $request, Task $task, AttachmentService $attachmentService): RedirectResponse
    {
        $data = $request->validated();
        if (isset($data['is_done']) && $data['is_done']) {
            $data['done_at'] = now();
        } elseif (isset($data['is_done']) && !$data['is_done']) {
            $data['done_at'] = null;
        }
        if ($request->hasFile('attachments')) {
            $attachmentService->deletePhotos($task->attachments);
            $data['attachments'] = $attachmentService->uploadTaskPhotos(
                auth()->user(),
                $request->file('attachments')
            );
        }
        $task->update($data);
        return back()->with('success', 'Tugas berhasil diperbarui.');
    }
    public function destroy(Task $task, AttachmentService $attachmentService): RedirectResponse
    {
        $this->authorize('delete', $task);

        $attachmentService->deletePhotos($task->attachments);

        $task->delete();

        return back()->with('success', 'Tugas berhasil dihapus!');
    }
}
