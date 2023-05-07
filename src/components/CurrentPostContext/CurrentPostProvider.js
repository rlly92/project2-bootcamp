import React, { createContext, useState } from "react";

export const currentPostContext = createContext();

function CurrentPostProvider({ children }) {
    console.log("Provider is mounted");
    const [currentPost, setCurrentPost] = useState({});

    const postContext = {
        currentPost,
        setCurrentPost,
    };

    return (
        <currentPostContext.Provider value={postContext}>
            {children}
        </currentPostContext.Provider>
    );
}

export default CurrentPostProvider;
