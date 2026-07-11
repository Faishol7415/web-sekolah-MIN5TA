<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $actionFilter = $request->query('action', '');

        $logs = [
            [
                'id' => 1,
                'created_at' => now()->subMinutes(15)->toIso8601String(),
                'user' => ['name' => 'Super Admin'],
                'action' => 'Update Settings',
                'description' => 'Mengubah pengaturan website',
                'ip_address' => '127.0.0.1'
            ],
            [
                'id' => 2,
                'created_at' => now()->subHours(2)->toIso8601String(),
                'user' => ['name' => 'faishol_ack'],
                'action' => 'Create User',
                'description' => 'Menambahkan admin baru',
                'ip_address' => '192.168.100.5'
            ],
            [
                'id' => 3,
                'created_at' => now()->subDays(1)->toIso8601String(),
                'user' => ['name' => 'Super Admin'],
                'action' => 'Delete Post',
                'description' => 'Menghapus artikel berita',
                'ip_address' => '127.0.0.1'
            ],
            [
                'id' => 4,
                'created_at' => now()->subDays(2)->toIso8601String(),
                'user' => ['name' => 'Sistem'],
                'action' => 'System Backup',
                'description' => 'Backup database otomatis',
                'ip_address' => 'localhost'
            ]
        ];

        // Filter mock data
        if ($actionFilter) {
            $logs = array_filter($logs, function($log) use ($actionFilter) {
                return stripos($log['action'], $actionFilter) !== false;
            });
            $logs = array_values($logs);
        }

        return response()->json([
            'data' => $logs,
            'meta' => [
                'current_page' => 1,
                'last_page' => 1,
                'total' => count($logs)
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivityLog $activityLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActivityLog $activityLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityLog $activityLog)
    {
        //
    }
}
