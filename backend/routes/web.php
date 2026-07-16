<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Serve uploaded files directly (fix for cPanel where document root != public folder)
Route::get('/storage/{path}', function ($path) {
    $filePath = public_path('storage/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    return response()->file($filePath);
})->where('path', '.*');
