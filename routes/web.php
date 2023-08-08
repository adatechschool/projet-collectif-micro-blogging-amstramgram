<?php

use App\Http\Controllers\SettingController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PhotoController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Home', [
        'canRegister' => Route::has('register'),
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::get('/profile', function () {
    return Inertia::render('Profile/UserProfile');
})->middleware(['auth', 'verified'])->name('profile');


Route::middleware('auth')->group(function () {
    Route::get('/setting', [SettingController::class, 'edit'])->name('setting.edit');
    Route::patch('/setting', [SettingController::class, 'update'])->name('setting.update');
    Route::delete('/setting', [SettingController::class, 'destroy'])->name('setting.destroy');
    
    // Pour manipuler les posts de l'utilisateur sur son profil (delete et update)
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    // Soit ça : Route::patch('/profile', [PostController::class, 'update'])->name('profile.update');
    // Soit ça :
    Route::patch('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::patch('/bio', [PostController::class, 'updateBio'])->name('bio.update');

    // Récupérez les images, en s'assurant que c'est l'id de l'utilisateur connecté
    //Route::get('/users/{id}', function ($id) {
        //return App\Models\User::find($id);
    //});

});

// Création d'un nouveau endpoint et l'ajout d'une nouvelle route qui renvoie tous les posts
Route::get('/api/posts', function () {
    return App\Models\Post::all();
});

// Récupérez les posts, en s'assurant de charger les données de l'utilisateur
Route::get('/api/posts', function () {
    return App\Models\Post::with('user')->get();
});

// Créer un endpoint pour uploader la photo de profil
// routes/api.php
Route::post('api/photo', [PhotoController::class, 'uploadPhoto']);

require __DIR__ . '/auth.php';
require __DIR__ . '/post.php';
