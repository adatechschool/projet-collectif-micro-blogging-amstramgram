import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

function Profile({auth}) {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        axios.get('/posts') // Assuming '/posts' is the route for your PostController@index
            .then(response => {
                setPosts(response.data);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('/posts', { title, content }) // Assuming '/posts' is the route for your PostController@store
            .then(response => {
                setPosts([...posts, response.data]); // Add the new post at the start of the posts
                setTitle(""); // Clear the title
                setContent(""); // Clear the content
            });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
        <div  className='w-screen'>
            <h1 className="text-center text-xl m-2">Your Profile</h1>
            <div className="mt-20 mb-10">
            <form onSubmit={handleSubmit} className='bg-gray-200 w-3/4 mx-auto p-6'>
            <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="block w-2/4 min-w-fit border rounded-lg shadow-md"
            required
        />
        <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Content"
            className="block w-2/4 min-w-fit mt-2 border rounded-lg shadow-md"
        />
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 m-2 block mx-auto text-white bg-purple-600 rounded-lg shadow-md"
                >
                    Create post
                </button>
            </form>
            </div>
            {posts.map(post => (
                <div key={post.id} className='bg-purple-200 block w-4/5 lg:w-1/3  mx-auto m-2 p-2 rounded-xl'>
                    <h2>Title: {post.title}</h2>
                    <p>Post: {post.content}</p>
                    {/* <p>User_id: {post.user_id}</p>   A commenter  */}
                </div>
            ))}
     
        </div>
        </AuthenticatedLayout>
    );
  
}

export default Profile;

