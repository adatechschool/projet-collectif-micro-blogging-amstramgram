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
            fetch(`/api/posts?per_page=5&page=${page}`)
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
                posts.map(
                    (post) =>
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
            <Head title="Home" />
            <AuthenticatedLayout user={auth.user}>
                <div className="mx-auto text-center space-y-10">
                    <h1 className="text-4xl m-5">Home</h1>
                    <div className="grid md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="w-3/4 space-y-6 text-xl bg-purple-100 rounded-md m-auto pb-5"
                            >
                                {/* Author */}
                                <p className="text-sm text-left p-2">
                                    Posted by {post.user.name}
                                </p>

                                {/* Image */}
                                <div className="flex justify-center">
                                    <img
                                        src="https://picsum.photos/200/300"
                                        alt={post.title}
                                        className="w-full h-1/4 object-cover"
                                    />
                                </div>

                                {/* Reaction Icons */}
                                <div className="ReactionIcon flex items-start space-x-4 pl-2">
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
                        ))}
                    </div>
                </div>

                {isloading && (
                    <div className="loading-overlay">
                        <BarLoader />
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}
