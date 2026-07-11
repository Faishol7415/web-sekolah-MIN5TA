<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $achievements = Achievement::latest()->paginate(10);
        return response()->json($achievements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:Akademik,Non-Akademik,akademik,non_akademik',
            'level' => 'required|string|max:100',
            'year' => 'required|digits:4',
            'date' => 'nullable|date',
            'participant' => 'nullable|string|max:255',
            'rank' => 'nullable|string|max:100',
            'image' => 'nullable|string',
            'organizer' => 'nullable|string'
        ]);

        $achievement = Achievement::create($validated);

        return response()->json([
            'message' => 'Prestasi berhasil ditambahkan',
            'data' => $achievement
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Achievement $achievement)
    {
        return response()->json(['data' => $achievement]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:Akademik,Non-Akademik,akademik,non_akademik',
            'level' => 'required|string|max:100',
            'year' => 'required|digits:4',
            'date' => 'nullable|date',
            'participant' => 'nullable|string|max:255',
            'rank' => 'nullable|string|max:100',
            'image' => 'nullable|string',
            'organizer' => 'nullable|string'
        ]);

        $achievement->update($validated);

        return response()->json([
            'message' => 'Prestasi berhasil diperbarui',
            'data' => $achievement
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Achievement $achievement)
    {
        $achievement->delete();
        return response()->json(['message' => 'Prestasi berhasil dihapus']);
    }
}
