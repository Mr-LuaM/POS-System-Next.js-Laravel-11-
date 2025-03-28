<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // ✅ Check if user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized - Not Authenticated'], 401);
        }

        // ✅ Check if user has one of the allowed roles
        if (!in_array(auth()->user()->role, $roles)) {
            return response()->json(['message' => 'Unauthorized - Access Denied'], 403);
        }

        return $next($request);
    }
}
