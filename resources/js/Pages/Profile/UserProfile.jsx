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
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            biographie: user.biographie,
        });

    const handleBioSubmit = (event) => {
        event.preventDefault();

        patch(route("profile.update"));
    };
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState([]);
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [updatingPostId, setUpdatingPostId] = useState(null);

    useEffect(() => {
        axios.get("/posts").then((response) => {
            setPosts(response.data);
        });
    }, []);

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
            // {
            //method: 'DELETE'
            // })
            .then((response) => {
                setPosts(posts.filter((post) => post.id !== id));
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
   
    const handleButtonClick = (id) => {
        setUpdatingPostId(id);
        
        ;
    };

    const handleInputChange1 = (event) => {
        setInputValue1(event.target.value);
    };

    const handleInputChange2 = (event) => {
        setInputValue2(event.target.value);
    };

    const updatePost = (id) => {
        axios
            .put(`/posts/${id}`)
            .then((response) => {
                console.log("test");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <>
            <Head title="Profile" />
            <AuthenticatedLayout user={auth.user}>
                <div className="w-screen flex flex-col items-center justify-center">
                    <h1 className="text-center text-4xl m-2">Your Profile</h1>

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

                        <div className="flex items-center gap-4">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="mt-2 px-4 py-2 m-2 block bg-purple-600 hover:bg-black duration-500 "
                            >
                                Save
                            </PrimaryButton>

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

                    <div className="m-2"> </div>

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

                    <div className="m-2"> </div>

                    {posts.map((post) => (
    <div
        key={post.id}
        className="w-1/2 ml-12 p-6 text-center m-4 space-y-4 bg-purple-200 block rounded-xl"
    >
        <h2>Title: {post.title}</h2>
        <p>Post: {post.content}</p>

        {updatingPostId === post.id && (
            <div>
                <input 
                    type="text"
                    value={inputValue1}
                    onChange={handleInputChange1}
                    placeholder="Input 1"
                />
                <input
                    type="text"
                    value={inputValue2}
                    onChange={handleInputChange2}
                    placeholder="Input 2"
                />
            </div>
        )}

        <button
            onClick={() => handleButtonClick(post.id)}
            className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
        >
            Update
        </button>

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
