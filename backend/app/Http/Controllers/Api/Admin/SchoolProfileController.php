<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolProfile;
use Illuminate\Http\Request;

class SchoolProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $profiles = SchoolProfile::orderBy('order', 'asc')->get();
        return response()->json(['data' => $profiles]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section' => 'required|string|max:100|unique:school_profiles',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $profile = SchoolProfile::create($validated);
        return response()->json(['data' => $profile, 'message' => 'Profil berhasil ditambahkan'], 201);
    }

    public function show($id)
    {
        $schoolProfile = SchoolProfile::findOrFail($id);
        return response()->json(['data' => $schoolProfile]);
    }

    public function update(Request $request, $id)
    {
        $schoolProfile = SchoolProfile::findOrFail($id);
        $validated = $request->validate([
            'section' => 'required|string|max:100|unique:school_profiles,section,' . $schoolProfile->id,
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $schoolProfile->update($validated);
        return response()->json(['data' => $schoolProfile->fresh(), 'message' => 'Profil berhasil diperbarui']);
    }

    public function destroy($id)
    {
        $schoolProfile = SchoolProfile::findOrFail($id);
        $schoolProfile->delete();
        return response()->json(['message' => 'Profil berhasil dihapus']);
    }
}
