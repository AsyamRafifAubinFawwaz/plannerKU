<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceTaskChecklist extends Model
{
    protected $fillable = ['workspace_task_id', 'title', 'is_done'];

    protected $casts = [
        'is_done' => 'boolean',
    ];

    public function task()
    {
        return $this->belongsTo(WorkspaceTask::class, 'workspace_task_id');
    }
}
