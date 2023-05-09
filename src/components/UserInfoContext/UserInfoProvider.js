import React, { createContext, useEffect, useState } from "react";
import { ref as dbRef, onChildAdded } from "firebase/database";

import { database } from "../../firebase";
const DB_USERINFO_KEY = "user_info";

export const UserInfoContext = createContext();

function UserInfoContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState([]);
    // const [currentUserInfo, setCurrentUserInfo] = useState({})

    useEffect(() => {
        const userInfoRef = dbRef(database, DB_USERINFO_KEY);

        onChildAdded(userInfoRef, (data) => {
            setUserInfo((prevState) => [
                ...prevState,
                {
                    key: data.key,
                    displayName: data.val().displayName,
                    email: data.val().email,
                    timeCreated: data.val().timeCreated,
                    uid: data.val().uid,
                    reputation: data.val().reputation,
                },
            ]);
        });

        console.log("listeners added");
    }, []);

    //  useEffect(() => {
    //      // find the selected post and update it
    //      if (selectedPost == null) return;

    //      const updatedPost = posts.find((post) => post.key === selectedPost.key);
    //      setSelectedPost(updatedPost);
    //  }, [posts]);

    const userInfoData = {
        userInfo,
        setUserInfo,
        // currentUserInfo,
        // setCurrentUserInfo,
    };

    return (
        <UserInfoContext.Provider value={userInfoData}>
            {children}
        </UserInfoContext.Provider>
    );
}

export default UserInfoContextProvider;
