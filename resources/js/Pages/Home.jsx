import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import BarLoader from "@/Components/BarLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

export default function Home({ auth, laravelVersion, phpVersion }) {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [isloading, setIsloaDing] = useState(true);
    const [expandedPosts, setExpandedPosts] = useState({});

    // Gestion de l'affichage de plus de contenu des posts
    const toggleExpanded = (postId) => {
        setExpandedPosts({
            ...expandedPosts,
            [postId]: !expandedPosts[postId],
        });
    };

    // Faire un appel à l'API à cet endpoint pour récupérer tous les posts
    useEffect(() => {
        // Add a delay of 500 milliseconds before fetching the data
        setTimeout(() => {
            fetch(`http://127.0.0.1:8001/api/posts?per_page=5&page=${page}`)
                .then((response) => response.json())
                .then((data) =>
                    setPosts((prevPosts) => [...prevPosts, ...data])
                );
            setIsloaDing(false);
        }, 500);
    }, [page]);

    const toggleLike = async (postId, isLiked) => {
        const url = isLiked
            ? `/posts/${postId}/unlike`
            : `/posts/${postId}/like`;
        const response = await axios.post(url);

        if (response.status === 200) {
            // Map over your posts and update the liked post
            setPosts(
                posts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              liked: !isLiked,
                              likes_count: isLiked
                                  ? post.likes_count - 1
                                  : post.likes_count + 1,
                          }
                        : post
                )
            );
        }
    };

    // add limit to the content in the cards
    function truncateContent(content, limit = 50) {
        return content.length > limit
            ? content.substring(0, limit) + "..."
            : content;
    }

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setIsloaDing(true);
            setPage((prev) => prev + 1);
        }
    };
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
        
           
            <AuthenticatedLayout 
            user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>} >
            <Head title="Home" />

            <div class="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-purple-900 selection:bg-red-500 selection:text-white">
                <div className="mx-auto text-center space-y-10 m-5 ">
                    {/* <h1 className="text-4xl m-5">Home</h1> */}
                    <div class="max-w-7xl mx-auto p-6 lg:p-8">
                       
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                
                                    {posts.map((post) => (
                                <div className="flex flex-col items-center justify-center scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500">
                                    <div key={post.id}

                    
                                         className=" space-y-2 text-xl bg-purple-100 rounded-md m-4 pb-5">
                                            {/* Author */}
                                            <p className="text-sm text-left p-2">
                                                Posted by {post.user.name}
                                            </p>

                                        {/* Image */}
                                       
                                        <div className="rounded-full">
                                            <img
                                                className="w-82 p-3 rounded-3xl"
                                                src={post && post.image
                                    ? `http://127.0.0.1:5173/public/storage/images/${post.image}`
                                    : `https://picsum.photos/200/300`}/>
                                       </div>
                                </div>    
                                       {/* Reaction Icons */}
                            <div className="flex flex-col items-center justify-center mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                <div className="ReactionIcon flex items-start space-x-4 pl-2 ">
                                    <div
                                        className={`hover:text-red-400 cursor-pointer ${
                                            post.liked ? "text-red-500" : ""
                                        }`}
                                        onClick={() =>
                                            toggleLike(post.id, post.liked)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faHeart} />{" "}
                                        <span className="text-xs">
                                            {post.likes_count < 1
                                                ? `Likes`
                                                : `${post.likes_count} Likes`}
                                        </span>
                                    </div>
                                    <div className="hover:text-slate-400">
                                        <FontAwesomeIcon icon={faComment} />{" "}
                                        {post.comments}
                                    </div>
                                </div>
                                
                                {/* Title and content of the post */}
                                <h2 className="text-left pl-2 mt-4 mb-2 text-lg">
                                    {post.title}
                                </h2>
                                <p
                                    className="mb-4 overflow-ellipsis pl-2 cursor-pointer text-left text-sm"
                                    onClick={() => toggleExpanded(post.id)}
                                >
                                    {expandedPosts[post.id]
                                        ? post.content
                                        : truncateContent(post.content)}
                                </p>
                            </div>
                            </div>
                        ))}
                    </div>
                  
                    </div>
                </div>

                {isloading && (
                    <div className="loading-overlay">
                        <BarLoader />
                    </div>
                )}
                </div>
            </AuthenticatedLayout>
        </>
        
    );
}
