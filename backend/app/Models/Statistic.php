<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    protected $fillable = [
        'label', 'value', 'icon', 'suffix', 'order', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
