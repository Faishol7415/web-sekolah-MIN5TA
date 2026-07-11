<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SchoolProfileController extends Controller
{
    public function index()
    {
        $profiles = \App\Models\SchoolProfile::where('is_active', true)
                                             ->orderBy('order', 'asc')
                                             ->get();
        return response()->json(['data' => $profiles]);
    }

    public function show($section)
    {
        $profile = \App\Models\SchoolProfile::where('section', $section)
                                            ->where('is_active', true)
                                            ->first();
        
        if (!$profile) {
            return response()->json(['message' => 'Profile section not found'], 404);
        }

        return response()->json(['data' => $profile]);
    }
}
