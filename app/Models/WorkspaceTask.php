<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceTask extends Model
{
    protected $fillable = ['workspace_id', 'title', 'status', 'assigned_to', 'due_date'];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
