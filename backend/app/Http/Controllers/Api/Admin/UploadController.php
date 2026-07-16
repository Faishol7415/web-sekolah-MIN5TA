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
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Bypass Storage facade dan simpan langsung ke folder public
            $file->move(public_path('storage/uploads'), $filename);
            
            $path = 'uploads/' . $filename;
            
            return response()->json([
                'url' => url('storage/' . $path),
                'path' => $path
            ]);
        }
        
        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
