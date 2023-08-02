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

    useEffect(() => {
        axios
            .get("/posts")
            .then((response) => {
                setPosts(response.data);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post("/posts", { title, content })
            .then((response) => {
                setPosts([...posts, response.data]);
                setTitle(""); 
                setContent(""); 
            });
    };

    return (
        <>
            <Head title="Profile" />
            <AuthenticatedLayout user={auth.user}>
                <div className="w-screen">
                    <h1 className="text-center text-xl m-2">Your Profile</h1>
                    
                    <form
                        onSubmit={handleBioSubmit}
                        className="mt-6 space-y-6 ml-12 bg-gray-200 w-1/2 p-2"
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
                            <PrimaryButton type="submit" disabled={processing} className="mt-2 px-4 py-2 m-2 block bg-purple-600 hover:bg-black duration-500 ">
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
                    <div className="mt-20 mb-10">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-gray-200 w-1/2 ml-12 p-6 space-y-4"
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
                                className="mt-2 px-4 py-2 m-2 block text-white bg-purple-600 rounded-lg shadow-md hover:bg-black duration-500 "
                            >
                                Create post
                            </button>

                          
                        </form>
                    </div>

                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-purple-200 block w-4/5 lg:w-1/3  mx-auto m-2 p-2 rounded-xl"
                        >
                            <h2>Title: {post.title}</h2>
                            <p>Post: {post.content}</p>
                            {/* <p>User_id: {post.user_id}</p>   A commenter  */}
                        </div>
                    ))}
                </div>
            </AuthenticatedLayout>
        </>
    );
}

export default Profile;
