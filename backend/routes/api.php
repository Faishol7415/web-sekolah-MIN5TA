<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// Public API Routes (Visitor tracking middleware can be added here if globally needed, but usually applied to web routes)
Route::group(['namespace' => 'App\Http\Controllers\Api\Public'], function () {
    Route::get('/settings', 'SettingController@index');
    Route::get('/sliders', 'SliderController@index');
    Route::get('/school-profiles', 'SchoolProfileController@index');
    Route::get('/school-profiles/{section}', 'SchoolProfileController@show');
    Route::get('/organization-structures', 'OrganizationStructureController@index');
    Route::get('/teachers', 'TeacherController@index');
    Route::get('/facilities', 'FacilityController@index');
    Route::get('/programs', 'ProgramController@index');
    Route::get('/statistics', 'StatisticController@index');
    
    Route::get('/posts', 'PostController@index');
    Route::get('/posts/{slug}', 'PostController@show');
    Route::get('/categories', 'CategoryController@index');
    
    Route::get('/achievements', 'AchievementController@index');
    Route::get('/events', 'EventController@index');
    
    Route::get('/downloads', 'DownloadController@index');
    Route::get('/downloads/{id}/file', 'DownloadController@download');
    
    Route::post('/contacts', 'ContactController@store');
    
    Route::get('/testimonials', 'TestimonialController@index');
    Route::get('/partners', 'PartnerController@index');
    
    Route::post('/visitors', 'VisitorController@store');
});

// Serve uploaded files via API route (bypasses cPanel document root issues)
Route::get('/files/{path}', function ($path) {
    $filePath = public_path('storage/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    return response()->file($filePath);
})->where('path', '.*');

Route::get('/migrate', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return response()->json([
            'status' => 'success',
            'message' => 'Database berhasil di-migrate!',
            'output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Admin API Routes
Route::group([
    'prefix' => 'admin', 
    'middleware' => ['auth:sanctum'],
    'namespace' => 'App\Http\Controllers\Api\Admin'
], function () {
    
    Route::get('/dashboard', 'DashboardController@index');
    
    // CRUD Endpoints
    Route::post('/settings/batch', 'SettingController@batchUpdate');
    Route::apiResource('settings', 'SettingController');
    Route::apiResource('sliders', 'SliderController');
    Route::apiResource('school-profiles', 'SchoolProfileController');
    Route::apiResource('organization-structures', 'OrganizationStructureController');
    Route::apiResource('teachers', 'TeacherController');
    Route::apiResource('facilities', 'FacilityController');
    Route::apiResource('programs', 'ProgramController');
    Route::apiResource('statistics', 'StatisticController');
    Route::apiResource('categories', 'CategoryController');
    Route::apiResource('posts', 'PostController');
    Route::apiResource('achievements', 'AchievementController');
    Route::apiResource('events', 'EventController');
    Route::apiResource('downloads', 'DownloadController');
    
    Route::get('/contacts', 'ContactController@index');
    Route::put('/contacts/{id}/read', 'ContactController@markAsRead');
    Route::delete('/contacts/{id}', 'ContactController@destroy');
    
    Route::apiResource('testimonials', 'TestimonialController');
    Route::apiResource('partners', 'PartnerController');
    
    // User & Roles
    Route::apiResource('users', 'UserController');
    Route::apiResource('roles', 'RoleController');
    Route::get('/permissions', 'RoleController@permissions');
    
    Route::get('/activity-logs', 'ActivityLogController@index');
    Route::get('/visitors/stats', 'VisitorController@stats');
    
    Route::post('/upload', 'UploadController@store');
});
