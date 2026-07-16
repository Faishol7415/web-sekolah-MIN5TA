<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Achievement;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display dashboard statistics and recent activities.
     */
    public function index(Request $request)
    {
        // 1. Total Berita
        $totalBerita = Post::count();
        $beritaLastMonth = Post::whereMonth('created_at', now()->subMonth()->month)->count();
        $beritaTrend = $this->calculateTrend($totalBerita, $beritaLastMonth);

        // 2. Total Prestasi
        $totalPrestasi = Achievement::count();
        $prestasiLastMonth = Achievement::whereMonth('created_at', now()->subMonth()->month)->count();
        $prestasiTrend = $this->calculateTrend($totalPrestasi, $prestasiLastMonth);

        // 3. Pengunjung Bulan Ini
        $currentMonthVisitors = Visitor::whereMonth('visited_at', now()->month)
                                      ->whereYear('visited_at', now()->year)
                                      ->count();
        $lastMonthVisitors = Visitor::whereMonth('visited_at', now()->subMonth()->month)
                                   ->whereYear('visited_at', now()->subMonth()->year)
                                   ->count();
        $visitorTrend = $this->calculateTrend($currentMonthVisitors, $lastMonthVisitors);
        
        // Format visitors to K if >= 1000
        $formattedVisitors = $currentMonthVisitors >= 1000 
            ? round($currentMonthVisitors / 1000, 1) . 'K' 
            : (string) $currentMonthVisitors;

        // Metrics Array
        $metrics = [
            [
                'id' => 'berita',
                'title' => 'Total Berita',
                'value' => (string) $totalBerita,
                'trend' => $beritaTrend['text'],
                'isPositive' => $beritaTrend['isPositive'],
                'type' => 'news'
            ],
            [
                'id' => 'prestasi',
                'title' => 'Total Prestasi',
                'value' => (string) $totalPrestasi,
                'trend' => $prestasiTrend['text'],
                'isPositive' => $prestasiTrend['isPositive'],
                'type' => 'achievement'
            ],
            [
                'id' => 'pengunjung',
                'title' => 'Pengunjung Bulan Ini',
                'value' => $formattedVisitors,
                'trend' => $visitorTrend['text'],
                'isPositive' => $visitorTrend['isPositive'],
                'type' => 'visitor'
            ],
        ];

        // 4. Recent Activities (Mocked from actual data)
        // Since we don't have a robust activity_logs table populated yet, 
        // we'll fetch recent posts and achievements to simulate activities.
        $recentPosts = Post::with('user')->orderBy('created_at', 'desc')->take(3)->get()->map(function ($post) {
            return [
                'id' => 'post_' . $post->id,
                'action' => 'Berita Baru',
                'target' => substr($post->title, 0, 40) . (strlen($post->title) > 40 ? '...' : ''),
                'user' => $post->user ? $post->user->name : 'Admin',
                'time' => $post->created_at->diffForHumans(),
                'created_at' => $post->created_at
            ];
        });

        $recentAchievements = Achievement::orderBy('created_at', 'desc')->take(2)->get()->map(function ($ach) {
            return [
                'id' => 'ach_' . $ach->id,
                'action' => 'Prestasi Baru',
                'target' => substr($ach->title, 0, 40) . (strlen($ach->title) > 40 ? '...' : ''),
                'user' => 'Admin', // Assuming admin added it
                'time' => $ach->created_at->diffForHumans(),
                'created_at' => $ach->created_at
            ];
        });

        // Merge and sort
        $recentActivities = $recentPosts->concat($recentAchievements)->sortByDesc('created_at')->values()->all();
        
        // Remove created_at from output
        $recentActivities = array_map(function($item) {
            unset($item['created_at']);
            return $item;
        }, $recentActivities);

        return response()->json([
            'metrics' => $metrics,
            'recentActivities' => $recentActivities
        ]);
    }

    private function calculateTrend($current, $previous)
    {
        if ($previous == 0) {
            return [
                'text' => $current > 0 ? '+100%' : '0%',
                'isPositive' => $current >= 0
            ];
        }

        $difference = $current - $previous;
        $percentage = round(($difference / $previous) * 100);
        
        return [
            'text' => ($percentage > 0 ? '+' : '') . $percentage . '%',
            'isPositive' => $percentage >= 0
        ];
    }
}
