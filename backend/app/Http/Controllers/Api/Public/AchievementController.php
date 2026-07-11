<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = \App\Models\Achievement::where('is_active', true)
                            ->orderBy('year', 'desc')
                            ->orderBy('date', 'desc')
                            ->get();
        return response()->json(['data' => $achievements]);
    }
}
