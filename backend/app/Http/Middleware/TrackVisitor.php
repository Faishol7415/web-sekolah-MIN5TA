<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Visitor;

class TrackVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get visitor data
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        $pageUrl = $request->fullUrl();
        $referrer = $request->header('referer');
        
        // Prevent logging the same IP for the same page within a short timeframe (e.g., 5 minutes)
        $recentVisit = Visitor::where('ip_address', $ip)
            ->where('page_url', $pageUrl)
            ->where('visited_at', '>=', now()->subMinutes(5))
            ->first();

        if (!$recentVisit) {
            Visitor::create([
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'page_url' => $pageUrl,
                'referrer' => $referrer,
                'visited_at' => now(),
            ]);
        }

        return $next($request);
    }
}
