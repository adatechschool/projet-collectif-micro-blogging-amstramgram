import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function Home({ auth, laravelVersion, phpVersion }) {
    const [posts, setPosts] = useState([]);
    // Faire un appel à l'API à cet endpoint pour récupérer tous les posts
    useEffect(() => {
        fetch('/api/posts')
            .then(response => response.json())
            .then(data => setPosts(data));
    }, []);

    return (
        <>
            <Head title="Home" />
            <AuthenticatedLayout
                user={auth.user}
            >
                <h1>Home</h1>
                <div>
                    {posts.map(post => (
                    <div key={post.id}
                         className="bg-purple-200 block w-4/5 lg:w-1/3  mx-auto m-2 p-2 rounded-xl"
                    >
                        <h1></h1>
                        <h2>{post.title}</h2>
                        <h3>{post.content}</h3>
                        {/* Accéder au nom de l'utilisateur */}
                        <p style={{fontSize: 'small', textAlign: 'right'}}>Posted by {post.user.name}</p>   
                    </div>
                    ))}
                    </div>
            </AuthenticatedLayout>
            
        </>
    );
}
