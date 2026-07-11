<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of published posts.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 9);
        
        $posts = Post::with(['category', 'user'])
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($limit);

        return response()->json($posts);
    }

    /**
     * Display the specified post by slug.
     */
    public function show($slug)
    {
        // Allow fetching by slug even if draft, to support "Preview" functionality.
        // In a strict environment, we'd add `->where('status', 'published')`
        $post = Post::with(['category', 'user'])
            ->where('slug', $slug)
            ->first();

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        // Increment view count
        $post->increment('view_count');

        return response()->json([
            'data' => $post
        ]);
    }
}
