<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = \App\Models\Slider::where('is_active', true)
                                     ->orderBy('order', 'asc')
                                     ->get();
        return response()->json(['data' => $sliders]);
    }
}
