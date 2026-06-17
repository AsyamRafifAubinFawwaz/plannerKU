<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceTask extends Model
{
    protected $fillable = ['workspace_id', 'column_id', 'title', 'order', 'due_date', 'description', 'cover_image', 'attachments', 'labels'];

    protected $casts = [
        'due_date' => 'datetime',
        'attachments' => 'array',
        'labels' => 'array',
    ];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function column()
    {
        return $this->belongsTo(WorkspaceColumn::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'workspace_task_user');
    }

    public function checklists()
    {
        return $this->hasMany(WorkspaceTaskChecklist::class);
    }
}
