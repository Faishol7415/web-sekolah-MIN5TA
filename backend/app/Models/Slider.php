<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Slider extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'subtitle', 'image', 'button_text', 'button_url', 'button2_text', 'button2_url', 'order', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
