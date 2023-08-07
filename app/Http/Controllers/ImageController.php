<?php

// app/Http/Controllers/ImageController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            return response()->json(['imagePath' => $imagePath], 200);
        }
        
        return response()->json(['message' => 'No image uploaded'], 400);
    }
}

