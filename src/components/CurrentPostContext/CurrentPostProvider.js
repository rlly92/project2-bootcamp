import React, { createContext, useEffect, useState } from "react";
import {
    ref as dbRef,
    off,
    onChildAdded,
    onChildChanged,
} from "firebase/database";

import { database } from "../../firebase";
const DB_POSTS_KEY = "posts";

export const currentPostContext = createContext();

function CurrentPostProvider({ children }) {
    const [selectedPost, setSelectedPost] = useState({});
    const [posts, setPosts] = useState([]);

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
                    reviews: data.val().reviews,
                    type: data.val().type,
                    tags: data.val().tags,
                    comments: data.val().comments,
                    authorDisplayName: data.val().authorDisplayName,
                    authorUid: data.val().authorUid,
                    date: data.val().date,
                },
            ]);
        });

        onChildChanged(postsRef, (data) => {
            setPosts((prevPosts) => {
                let changedPost = prevPosts.find(
                    (post) => post.key === data.key
                );
                let index = prevPosts.indexOf(changedPost);
                console.log(index);
                let copy = [...prevPosts];
                copy.splice(index, 1, {
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
                    reviews: data.val().reviews,
                    type: data.val().type,
                    tags: data.val().tags,
                    comments: data.val().comments,
                    authorDisplayName: data.val().authorDisplayName,
                    authorUid: data.val().uid,
                    date: data.val().date,
                });
                return [...copy];
            });
        });

        console.log("listeners added");
        // return () => {
        //     console.log("removing listeners");
        //     off(postsRef);
        // };
    }, []);

    useEffect(() => {
        // find the selected post and update it
        if (selectedPost == null) return;

        const updatedPost = posts.find((post) => post.key === selectedPost.key);
        setSelectedPost(updatedPost);
    }, [posts]);

    const postContext = {
        posts,
        setPosts,
        selectedPost,
        setSelectedPost,
    };

    return (
        <currentPostContext.Provider value={postContext}>
            {children}
        </currentPostContext.Provider>
    );
}

export default CurrentPostProvider;
