<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkspaceColumn extends Model
{
    protected $fillable = ['workspace_id', 'name', 'order'];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tasks()
    {
        return $this->hasMany(WorkspaceTask::class, 'column_id')->orderBy('order');
    }
}
