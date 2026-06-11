<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'start_date',
        'end_date',
        'color',
        'notes',
        'is_done'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function casts(): array{
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_done' => 'boolean'
        ];
    }

    public function scopeMultiDay($query){
        return $query->whereNotNull('end_date');
    }

    public function scopeSingleDay($query){
        return $query->whereNull('end_date');
    }
}
