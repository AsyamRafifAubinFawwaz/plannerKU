<?php

use App\Models\Workspace;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('workspace.{id}', function ($user, $id) {
    $workspace = Workspace::find($id);
    return $workspace && ($workspace->owner_id === $user->id || $workspace->members->contains($user->id));
});

// Channel personal untuk notifikasi undangan real-time
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
