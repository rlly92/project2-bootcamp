import React, { useState, useEffect, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { UserInfoContext } from "../components/UserInfoContext/UserInfoProvider";

import { ref as dbRef, push } from "firebase/database";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase";

const DB_USERINFO_KEY = "user_info";
const STORAGE_USER_PROFILEPIC_KEY = "user_profilepic";

function CreateProfile() {
    const navigate = useNavigate();
    const [state, setState] = useState({ displayName: "", profilePic: null });
    const context = useContext(UserContext);

    const userInfoData = useContext(UserInfoContext);

    const userInfoRef = dbRef(database, DB_USERINFO_KEY);
    const userProfilePicRef = storageRef(storage, STORAGE_USER_PROFILEPIC_KEY);

    useEffect(() => {
        if (context.loggedInUser == null) {
            navigate("/");
        }
    }, [context.loggedInUser]);

    console.log(userInfoData);

    const addUserName = async (displayName) => {
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
                        displayName: displayNameOfUser,
                        email: emailOfUser,
                        timeCreated: timeOfCreation,
                        uid: uID,
                        reputation: 0,
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

        const userObject = userInfoData.userInfo.find(
            (user) => user.displayName === state.displayName
        );

        if (userObject != null) {
            alert(
                "This username already exists. Please choose another username"
            );
            return;
        }

        if (!/^[a-z0-9]+$/.test(state.displayName)) {
            alert(
                "Invalid input. Please input only lowercase letters and numbers. No symbols or spaces allowed"
            );
            return;
        }

        addUserName(state.displayName).then(() => {
            navigate("/");
        });
    };
    const handleFileChange = (e) => {
        setState({ ...state, profilePic: e.target.files[0] });
        console.log(state);
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
        console.log(state);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={state.displayName}
                    id="displayName"
                    type="displayName"
                    placeholder="enter your username here"
                    onChange={handleChange}
                ></input>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Submit Username and Profile Pic</button>
            </form>
        </div>
    );
}
export default CreateProfile;
