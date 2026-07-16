<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of settings as a key-value object.
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        return response()->json($settings);
    }

    /**
     * Update or create multiple settings at once.
     */
    public function batchUpdate(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            // Null values can be saved as empty strings if needed, 
            // but usually we just save whatever is passed.
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully'
        ]);
    }
}
