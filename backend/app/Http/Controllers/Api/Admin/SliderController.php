<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sliders = Slider::orderBy('order', 'asc')->get();
        return response()->json(['data' => $sliders]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'required|string',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|string|max:255',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $slider = Slider::create($validated);
        return response()->json(['data' => $slider, 'message' => 'Slider created successfully'], 201);
    }

    public function show(Slider $slider)
    {
        return response()->json(['data' => $slider]);
    }

    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'required|string',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|string|max:255',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $slider->update($validated);
        return response()->json(['data' => $slider, 'message' => 'Slider updated successfully']);
    }

    public function destroy(Slider $slider)
    {
        $slider->delete();
        return response()->json(['message' => 'Slider deleted successfully']);
    }
}
