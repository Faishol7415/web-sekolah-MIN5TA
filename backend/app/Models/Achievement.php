<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Achievement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'type', 'level', 'year', 'date',
        'image', 'participant', 'rank', 'organizer', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
