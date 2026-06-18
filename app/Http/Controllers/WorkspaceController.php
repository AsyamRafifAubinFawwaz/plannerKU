<?php

namespace App\Http\Controllers;

use App\Events\InvitationReceived;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

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

        // Gratis: tidak boleh sama sekali
        abort_if($user->isFree(), 403, 'Fitur kolaborasi tersedia mulai paket Pro.');

        // Pro & Max: cek limit workspace yang dimiliki
        abort_if(!$user->canCreateWorkspace(), 403, 'Paket Pro hanya dapat memiliki 1 ruang kerja. Upgrade ke Max untuk ruang kerja tak terbatas.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $workspace = $user->ownedWorkspaces()->create($validated);
        $workspace->members()->attach($user->id, ['role' => 'admin']);

        return back()->with('success', 'Ruang kerja berhasil dibuat.');
    }

    public function show(Request $request, Workspace $workspace)
    {
        $user = $request->user();
        abort_if(!$workspace->members->contains($user) && $workspace->owner_id !== $user->id, 403);

        $workspace->load(['members', 'columns.tasks.members', 'columns.tasks.checklists']);

        return Inertia::render('collaboration/show', [
            'workspace' => $workspace,
        ]);
    }

    public function addMember(Request $request, Workspace $workspace)
    {
        $user = $request->user();

        // Hanya Max yang bisa mengundang
        abort_if(!$user->canInviteMember(), 403, 'Mengundang anggota hanya tersedia di paket Max.');
        abort_if($workspace->owner_id !== $user->id, 403, 'Hanya pembuat ruang kerja yang dapat mengundang anggota.');

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $member = User::where('email', $request->email)->first();

        abort_if($workspace->members->contains($member), 422, 'Pengguna sudah menjadi anggota.');

        $existingInvite = WorkspaceInvitation::where('workspace_id', $workspace->id)
            ->where('user_id', $member->id)
            ->where('status', 'pending')
            ->first();

        abort_if($existingInvite, 422, 'Pengguna sudah memiliki undangan yang menunggu.');

        $invitation = WorkspaceInvitation::create([
            'workspace_id' => $workspace->id,
            'invited_by'   => $user->id,
            'user_id'      => $member->id,
            'status'       => 'pending',
        ]);

        $invitation->load(['workspace', 'invitedBy']);

        broadcast(new InvitationReceived($invitation, $member->id));

        return back()->with('success', 'Undangan berhasil dikirim ke ' . $member->name . '.');
    }

    public function acceptInvitation(Request $request, WorkspaceInvitation $invitation)
    {
        abort_if($invitation->user_id !== $request->user()->id, 403);
        abort_if($invitation->status !== 'pending', 422, 'Undangan sudah tidak valid.');

        $invitation->update(['status' => 'accepted']);
        $invitation->workspace->members()->syncWithoutDetaching([
            $invitation->user_id => ['role' => 'member']
        ]);

        return redirect('/collaboration/' . $invitation->workspace_id)
            ->with('success', 'Kamu berhasil bergabung ke ' . $invitation->workspace->name . '!');
    }

    public function declineInvitation(Request $request, WorkspaceInvitation $invitation)
    {
        abort_if($invitation->user_id !== $request->user()->id, 403);

        $invitation->update(['status' => 'declined']);

        return back()->with('success', 'Undangan telah ditolak.');
    }
}
