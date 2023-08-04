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
                <div className="mx-auto text-center">
                    <h1 className="text-4xl m-5">Home</h1>
                    {posts.map(post => (
                        <div key={post.id}
                            className="w-full md:w-1/2 mx-auto p-6 space-y-6 text-xl bg-purple-200 block m-4 rounded-xl"
                        >
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
