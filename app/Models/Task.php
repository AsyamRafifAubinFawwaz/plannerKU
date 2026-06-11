<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Task extends Model
{
    protected $fillable = [
        'title',
        'category',
        'due_date',
        'is_done',
        'done_at',
        'notes',
        'attachments',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'is_done' => 'boolean',
            'done_at' => 'datetime',
            'attachments' => 'array',
        ];
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('is_done', false);
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today());
    }

    protected static function booted(): void
    {
        static::deleting(function (Task $task) {
            // Hapus file fisik dari storage jika ada lampiran
            if (!empty($task->attachments)) {
                foreach ($task->attachments as $photoPath) {
                    Storage::disk('public')->delete($photoPath);
                }
            }
        });
    }
}
