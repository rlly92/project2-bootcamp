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

    const userInfoRef = dbRef(database, DB_USERINFO_KEY);
    const userProfilePicRef = storageRef(storage, STORAGE_USER_PROFILEPIC_KEY);

    // edit the code here to allow user to update profile pic:
    const editProfilePic = async (displayName) => {
        try {
            const uploadTask = await uploadBytes(
                userProfilePicRef,
                state.profilePic
            );
            const downloadURL = await getDownloadURL(uploadTask.ref);
            return updateProfile(context.loggedInUser, {
                displayName,
                photoURL: downloadURL,
            })
                .then(() => {
                    console.log(displayName);
                })
                .then(() => {
                    const displayNameOfUser = context.loggedInUser.displayName;
                    const emailOfUser = context.loggedInUser.email;
                    const timeOfCreation =
                        context.loggedInUser.metadata.creationTime;
                    const uID = context.loggedInUser.uid;
                    const userInfo = {
                        photoURL: downloadURL,
                    };
                    push(userInfoRef, userInfo);
                })
                .then(() => {
                    console.log("Profile updated successfully!");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        editProfilePic().then(() => {
            navigate("/user/currentloggedinuser");
        });
    };
    const handleFileChange = (e) => {
        setState({ ...state, profilePic: e.target.files[0] });
        console.log(state);
    };
    return (
        <div>
            <h1>Welcome to {username} 's page! Browse wisely.</h1>
            <img
                src={context.loggedInUser.photoURL}
                alt="Profile Picture"
                style={{ width: "300px", height: "300px" }}
            />

            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Edit Profile Pic</button>
            </form>
        </div>
    );
}

export default UserProfilePage;
