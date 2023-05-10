import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProfile } from "firebase/auth";

import { ref as dbRef, push } from "firebase/database";
import { UserContext } from "../App";
import { UserInfoContext } from "../components/UserInfoContext/UserInfoProvider";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase";
import { render } from "react-dom";

const DB_USERINFO_KEY = "user_info";
const STORAGE_USER_PROFILEPIC_KEY = "user_profilepic";

function UserProfilePage(props) {
    const navigate = useNavigate();
    const [currentUserData, setCurrentUserData] = useState([]);
    const [state, setState] = useState({
        profilePic: null,
    });

    // current user context:
    const context = useContext(UserContext);

    // context for database of users and the data of each user within that database:
    const userInfoData = useContext(UserInfoContext);

    const { username } = useParams();

    // use username to filter through the userInfoData and find and then store
    // the current user's data in currentUserData so that it can be rendered

    const profilePic = () => {
        const currentUser = userInfoData.find(
            (user) => user.displayName === username
        );
        if (currentUser && currentUser.photoURL) {
            return <img src={currentUser.photoURL} alt="Profile pic" />;
        } else {
            return <div>No profile pic found</div>;
        }
    };

    const userInfoRef = dbRef(database, DB_USERINFO_KEY);
    const userProfilePicRef = storageRef(storage, STORAGE_USER_PROFILEPIC_KEY);

    return (
        <div>
            <h1>Welcome to {username} 's page! Browse wisely.</h1>
            {profilePic}
        </div>
    );
}

export default UserProfilePage;
