<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->latest()->paginate(10);
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan',
            'data' => $user->load('roles')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json(['data' => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'is_active' => 'boolean',
        ]);

        $dataToUpdate = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => $validated['is_active'] ?? true,
        ];

        if (!empty($validated['password'])) {
            $dataToUpdate['password'] = Hash::make($validated['password']);
        }

        $user->update($dataToUpdate);
        $user->syncRoles([$validated['role']]);

        return response()->json([
            'message' => 'Pengguna berhasil diperbarui',
            'data' => $user->load('roles')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Don't allow deleting the last super admin or currently authenticated user (optional but good practice)
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Tidak dapat menghapus akun Anda sendiri'], 400);
        }

        $user->delete();
        return response()->json(['message' => 'Pengguna berhasil dihapus']);
    }
}
