import React, { createContext, useEffect, useState } from "react";

import { onChildAdded, ref as dbRef } from "firebase/database";
import { database, storage, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";

const DB_POSTS_KEY = "posts";

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
                    coords: {
                        lat: data.val().coords.lat,
                        lng: data.val().coords.lng,
                    },
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
                setLoggedInUser(user);
            } else {
                console.log("no user currently signed in");
                setLoggedInUser(null);
            }
        });
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Home posts={posts} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;

// EXPERIMENTAL CHANGES MADE HERE FOR PRACTICE OF GIT PUSH GIT PULL

// I HAVE ACCIDENTALLY EDITED ON THE MAIN

// THIS IS THE SECOND BRANCH TEST

// THIS IS THE THIRD BRANCH TEST
