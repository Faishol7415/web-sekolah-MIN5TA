<?php

namespace App\Http\Controllers\Api\Public;

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
}
