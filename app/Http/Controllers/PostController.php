<?php
namespace App\Http\Controllers;

use App\Http\Requests\SettingUpdateRequest;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::where('user_id', auth()->id())->get();

        return response()->json($posts);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    /**
     * Store a newly created post in the database.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => Auth::user()->id,
        ]);


        return response()->json($post, 201);
    }
    public function show(Post $post)
    {
        return response()->json($post);
    }

    public function edit(Post $post)
    {
        return response()->json($post);
    }


    public function update(SettingUpdateRequest $request, Post $post): RedirectResponse
    {
        $request->user()->fill($request->validated());
        // $request->validate([
        //     'title' => 'required|string|max:255',
        //     'content' => 'nullable|string',
        //     'biographie' => 'nullable|string',
        // ]);

        // $post->update($request->all());

        // return response()->json($post);
        $request->user()->save();
        return Redirect::route('profile');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json(['success' => 'Post deleted successfully.']);
    }
}