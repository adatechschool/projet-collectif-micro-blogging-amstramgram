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
        $posts = Post::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->each
            ->append('liked');

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


    // update la biographie
    public function updateBio(SettingUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();
        return Redirect::route('profile');
    }

    // update les posts
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $post->update($request->all());

        return response()->json($post);
    }


    // delete les posts

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json(['success' => 'Post deleted successfully.']);
    }

    public function like(Post $post)
    {
        auth()->user()->likes()->create([
            'post_id' => $post->id,
        ]);
        return response()->json(['status' => 'success', 'message' => 'Post liked.']);
    }

    public function unlike(Post $post)
    {
        $post->likes()->where('user_id', auth()->user()->id)->delete();
        return response()->json(['status' => 'success', 'message' => 'Post unliked.']);
    }
    public function likes()
    {
        return $this->hasMany(Like::class);
    }


}