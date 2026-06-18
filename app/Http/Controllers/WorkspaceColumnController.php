<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Models\WorkspaceColumn;
use Illuminate\Http\Request;
use App\Events\WorkspaceUpdated;

class WorkspaceColumnController extends Controller
{
    public function store(Request $request, Workspace $workspace)
    {
        $user = $request->user();
        $request->validate(['name' => 'required|string|max:255']);

        // Cek batas kolom berdasarkan plan pemilik workspace
        $owner = $workspace->owner;
        $columnCount = $workspace->columns()->count();
        if ($columnCount >= $owner->maxColumnsPerWorkspace()) {
            return back()->withErrors(['name' => 'Paket Pro hanya mendukung maksimal 3 kolom. Upgrade ke Max untuk kolom tak terbatas.']);
        }

        $maxOrder = $workspace->columns()->max('order') ?? 0;
        $workspace->columns()->create([
            'name' => $request->name,
            'order' => $maxOrder + 1,
        ]);

        return back();
    }

    public function update(Request $request, WorkspaceColumn $column)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $column->update(['name' => $request->name]);
        return back();
    }

    public function destroy(WorkspaceColumn $column)
    {
        $column->delete();
        return back();
    }

    public function updateOrder(Request $request, Workspace $workspace)
    {
        $request->validate(['columns' => 'required|array']);
        
        foreach ($request->columns as $index => $columnId) {
            WorkspaceColumn::where('id', $columnId)->where('workspace_id', $workspace->id)->update(['order' => $index + 1]);
        }
        
        $workspace->load(['columns.tasks.members', 'columns.tasks.checklists']);
        broadcast(new WorkspaceUpdated($workspace->id, $workspace->columns))->toOthers();

        return back();
    }
}
