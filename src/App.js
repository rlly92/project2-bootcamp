import React, { createContext, useEffect, useState } from "react";

import { onChildAdded, ref as dbRef } from "firebase/database";
import { database, storage, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const DB_POSTS_KEY = "posts";

export const UserContext = createContext();

const App = () => {
    const [posts, setPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const postsRef = dbRef(database, DB_POSTS_KEY);

        onChildAdded(postsRef, (data) => {
            setPosts((prevPosts) => [
                ...prevPosts,
                {
                    key: data.key,
                    eventName: data.val().eventName,
                    geocodeName: data.val().geocodeName,
                    website: data.val().website,
                    coords: {
                        lat: data.val().coords.lat,
                        lng: data.val().coords.lng,
                    },
                    duration: {
                        startDate: data.val().duration.startDate,
                        endDate: data.val().duration.endDate,
                    },
                    images: data.val().images,
                    likes: data.val().likes,
                    dislikes: data.val().dislikes,
                    type: data.val().type,
                    tags: data.val().tags,
                    comments: data.val().comments,
                    author: data.val().author,
                    date: data.val().date,
                },
            ]);
        });

        // onChildChanged(messagesRef, (data) => {
        //     console.log("child changed");
        //     this.setState((state) => {
        //         let copy = [...state.messages];
        //         let currMessage = copy.find(
        //             (message) => message.key === data.key
        //         );

        //         let index = copy.indexOf(currMessage);

        //         state.messages.splice(index, 1, {
        //             key: data.key,
        //             msg: data.val().message,
        //             date: data.val().date,
        //             imageURL: data.val().imageURL,
        //             author: data.val().author,
        //             likes: data.val().likes,
        //         });

        //         return {
        //             copy,
        //         };
        //     });
        // });

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user is signed in");
                console.log(user);
                setLoggedInUser(user);
            } else {
                console.log("no user currently signed in");
                setLoggedInUser(null);
            }
        });
    }, []);

    const handleLogOut = () => {
        return new Promise((res, rej) => {
            res(
                signOut(auth).then(() => {
                    setLoggedInUser(null);
                })
            );
        });
    };

    const context = {
        loggedInUser,
        setLoggedInUser,
    };

    return (
        <div className="App">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
            />
            <UserContext.Provider value={context}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/">
                            <Route index element={<LoginPage />} />

                            <Route
                                path="home"
                                element={
                                    <Home
                                        posts={posts}
                                        handleLogOut={handleLogOut}
                                    />
                                }
                            />
                            <Route path="signup" element={<SignUpPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
};

export default App;
