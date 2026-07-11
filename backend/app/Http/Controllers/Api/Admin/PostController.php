<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('category', 'user');
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $posts = $query->orderBy('created_at', 'desc')->paginate(10);
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'image' => 'nullable|string'
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        // Assign user_id to currently authenticated user, or 1 for now if testing without full auth setup
        $validated['user_id'] = auth()->id() ?? 1;

        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);
        
        return response()->json([
            'message' => 'Berita berhasil ditambahkan',
            'data' => $post
        ], 201);
    }

    public function show(Post $post)
    {
        $post->load('category', 'user');
        return response()->json([
            'data' => $post
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'image' => 'nullable|string'
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        
        if ($validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);
        
        return response()->json([
            'message' => 'Berita berhasil diperbarui',
            'data' => $post
        ]);
    }

    public function destroy(Post $post)
    {
        $post->delete();
        
        return response()->json([
            'message' => 'Berita berhasil dihapus'
        ]);
    }
}
