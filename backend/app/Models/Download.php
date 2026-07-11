<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Download extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'file_path', 'file_size', 
        'file_type', 'download_count', 'category', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
