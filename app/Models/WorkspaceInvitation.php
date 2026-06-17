<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceInvitation extends Model
{
    protected $fillable = ['workspace_id', 'invited_by', 'user_id', 'status'];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function invitedBy()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
