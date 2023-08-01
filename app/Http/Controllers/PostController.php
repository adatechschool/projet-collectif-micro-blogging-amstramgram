<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class PostsController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Post');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'message' => 'required|text',
        ]);

        $post = Post::create([
            'message' => $request->message,

        ]);

        event(new Registered($post));

        Auth::login($post);

        return response('Coucou ça marche !', 200) 
        ->header('Content-Type', 'text/plain');


        //return redirect(RouteServiceProvider::HOME);
    }
}
