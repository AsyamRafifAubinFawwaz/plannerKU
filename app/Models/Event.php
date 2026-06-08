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
        'notes'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
