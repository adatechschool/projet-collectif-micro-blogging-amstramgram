<?php

use App\Http\Controllers\SettingController;
use App\Http\Controllers\PostController;

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
    // Route::patch('/profile', [PostController::class, 'update'])->name('profile.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::patch('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::patch('/bio', [PostController::class, 'updateBio'])->name('bio.update');
});


// Création d'un nouveau endpoint et l'ajout d'une nouvelle route qui renvoie tous les posts
// Récupérez les posts, en s'assurant de charger les données de l'utilisateur
Route::get('/api/posts', function (\Illuminate\Http\Request $request) {
    $limit = $request->input('per_page', 5);
    $page = $request->input('page', 1); 
    $offset = ($page - 1) * $limit;
    $posts = App\Models\Post::with('user')->orderBy('created_at', 'desc')->skip($offset)->take($limit)->get();
    $posts->each->append('liked');
    return $posts;
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts/{post}/like', [PostController::class, 'like']);
    Route::post('/posts/{post}/unlike', [PostController::class, 'unlike']);
});


// Route::get('/api/posts', function () {
//     return App\Models\Post::with('user')->orderBy('created_at', 'desc')->get();
// });
// Route::get('/api/posts', function () {
//     return App\Models\Post::with('user')->get();
// });


require __DIR__ . '/auth.php';
require __DIR__ . '/post.php';