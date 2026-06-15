<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Ambil workspace yang dimiliki atau diikuti
        $workspaces = $user->ownedWorkspaces()
            ->withCount('members', 'tasks')
            ->get()
            ->concat($user->workspaces()->withCount('members', 'tasks')->get())
            ->unique('id')
            ->values();

        return Inertia::render('collaboration/index', [
            'workspaces' => $workspaces,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        abort_if(!$user->isMax(), 403, 'Khusus paket Max');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $workspace = $user->ownedWorkspaces()->create($validated);
        
        // Owner otomatis jadi admin
        $workspace->members()->attach($user->id, ['role' => 'admin']);

        return back()->with('success', 'Ruang kerja berhasil dibuat.');
    }

    public function show(Request $request, Workspace $workspace)
    {
        $user = $request->user();

        // Pastikan user adalah member atau owner
        abort_if(!$workspace->members->contains($user) && $workspace->owner_id !== $user->id, 403);

        $workspace->load(['members', 'tasks.assignee']);

        return Inertia::render('collaboration/show', [
            'workspace' => $workspace,
        ]);
    }

    public function addMember(Request $request, Workspace $workspace)
    {
        $user = $request->user();
        abort_if(!$user->isMax(), 403);
        abort_if($workspace->owner_id !== $user->id, 403, 'Hanya pembuat ruang kerja yang dapat mengundang anggota.');

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $member = User::where('email', $request->email)->first();

        abort_if($workspace->members->contains($member), 422, 'Pengguna sudah menjadi anggota.');

        $workspace->members()->attach($member->id, ['role' => 'member']);

        return back()->with('success', 'Anggota berhasil ditambahkan.');
    }
}
