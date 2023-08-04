import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, usePage, Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";

import axios from "axios";

function Profile({ auth }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState([]);
    const [titleValue, setTitleValue] = useState("");
    const [ContentValue, setContentValue] = useState("");
    const [updatingPostId, setUpdatingPostId] = useState(null);

    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            biographie: user.biographie,
        });
    //  gestion de l'envoi du formulaire de la biographie
    const handleBioSubmit = (event) => {
        event.preventDefault();

        patch(route("bio.update"));
    };
    // récuperer les posts de l'user
    useEffect(() => {
        axios.get("/posts").then((response) => {
            setPosts(response.data);
        });
    }, []);
    // ajouter un nouveau post
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post("/posts", { title, content }).then((response) => {
            setPosts([...posts, response.data]);
            setTitle("");
            setContent("");
        });
    };

    // Pour supprimer un post
    const deletePost = (id) => {
        axios
            .delete(`/posts/${id}`)
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== id));
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    // Gestion du bouton qui permet de mettre à jour un post
    const handleButtonClick = (id) => {
        setUpdatingPostId(id);
        const postToUpdate = posts.find(post => post.id === id);
        setTitleValue(postToUpdate.title);
        setContentValue(postToUpdate.content);
    };

    // Gestion du changement de titre du post
    const handleTitleChange = (event) => {
        setTitleValue(event.target.value);
    };
    // Gestion du changement de Contenu du post
    const handleContentChange = (event) => {
        setContentValue(event.target.value);
    };
    // Fontion pour mettre à jour un post
    const updatePost = () => {
        axios
        .patch(`/posts/${updatingPostId}`, {
            title: titleValue,
            content: ContentValue,
        })
        .then((response) => {
            setPosts(
                posts.map((post) =>
                    post.id === updatingPostId ? response.data : post
                )
            );
            setUpdatingPostId(null); 
            setTitleValue(""); 
            setContentValue("");  
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    

    };

    return (
        <>
            <Head title="Profile" />
            <AuthenticatedLayout user={auth.user}>
                <div className="w-screen flex flex-col items-center justify-center">
                    <h1 className="text-center text-4xl m-2">Your Profile</h1>
                    {/* Formulaire de mise à jour de la biographie */}
                    <form
                        onSubmit={handleBioSubmit}
                        className="mt-6 space-y-6 ml-12 bg-gray-200 w-1/2 p-2 rounded-xl"
                    >
                        <div className="w-3/2 p-6">
                            <InputLabel
                                htmlFor="biographie"
                                value="Biographie"
                            />

                            <TextInput
                                id="biographie"
                                type="text"
                                className="mt-1 block w-10/12 te"
                                value={data.biographie}
                                onChange={(e) =>
                                    setData("biographie", e.target.value)
                                }
                                required
                                autoComplete="biographie"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.biographie}
                            />
                        </div>
                                {/* Save button */}
                        <div className="flex items-center gap-4">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="mt-2 px-4 py-2 m-2 block bg-purple-600 hover:bg-black duration-500 "
                            >
                                Save
                            </PrimaryButton>
                                     {/* Apparition du mot save quand on met à jour la biographie */}
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                                     {/* Formulaire pour l'ajout d'un nouveau post */}
                 

                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-200 w-1/2 text-center ml-12 p-6 space-y-4 rounded-xl"
                    >
                        <h2 className="text-center m-2">Add a new post</h2>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="block w-2/4 min-w-fit border rounded-lg shadow-md"
                            required
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                            className="block w-2/4 min-w-fit mt-2 border rounded-lg shadow-md"
                        />
                        <button
                            type="submit"
                            className="m-2 px-4 py-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                        >
                            Create post
                        </button>
                    </form>

                    {/* Affichage des posts de l'user */}

                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="w-1/2 ml-12 p-6 text-center m-4 space-y-4 bg-purple-200 block rounded-xl"
                        >
                            <h2>Title: {post.title}</h2>
                            <p>Post: {post.content}</p>
                                 {/* Updating post form */}
                            {updatingPostId === post.id && (
                                <div>
                                    <form onSubmit={(event) => { event.preventDefault(); updatePost() }}>

                                        <TextInput
                                            type="text"
                                            onChange={handleTitleChange}
                                            value={titleValue}
                                            id="inputTitle"
                                            required
                                            autoComplete="inputTitle"
                                        />
                                        <TextInput
                                            type="text"
                                            onChange={handleContentChange}
                                            value={ContentValue}
                                            id="inputContent"
                                            required
                                            autoComplete="inputContent"
                                        />
                                        <button
                                            type="submit"
                                            className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                                        >
                                            Confirm Update
                                        </button>
                                    </form>
                                </div>
                            )}
                             {/* Update a post button qui va déclencher l'apparition du formulaire pour update un post */}
                            <button
                                onClick={() => handleButtonClick(post.id)}
                                className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                            >
                                Update
                            </button>
                               {/* Delete post button */}
                            <button
                                onClick={() => deletePost(post.id)}
                                className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <div className="m-2"> </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

export default Profile;