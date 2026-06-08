<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'target_per_week',
        'current_streak',
        'longest_streak',
        'is_active',
        'sort_order'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function logs(){
        return $this->hasMany(HabitLog::class);
    }
}
