<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostsController;

//Route::middleware('auth')->group(function () {
    
    Route::get('post', [PostsController::class, 'create'])
    ->name('post');
    
    Route::post('post', [PostsController::class, 'store']);

//});


