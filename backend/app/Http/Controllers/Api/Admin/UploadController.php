<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);

        if ($request->file('file')) {
            $path = $request->file('file')->store('uploads', 'public');
            $url = Storage::url($path);
            
            return response()->json([
                'url' => url($url),
                'path' => $path
            ]);
        }
        
        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
