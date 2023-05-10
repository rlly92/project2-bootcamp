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
import { Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";

const DB_USERINFO_KEY = "user_info";
const STORAGE_USER_PROFILEPIC_KEY = "user_profilepic";

function CreateProfile() {
    const navigate = useNavigate();
    const [state, setState] = useState({ displayName: "", profilePic: null });
    const context = useContext(UserContext);

    const userInfoData = useContext(UserInfoContext);

    const userInfoRef = dbRef(database, DB_USERINFO_KEY);

    useEffect(() => {
        if (context.loggedInUser == null) {
            navigate("/");
        }
    }, [context.loggedInUser]);

    console.log(userInfoData);

    const addUserName = async (displayName) => {
        try {
            const userProfilePicRef = storageRef(
                storage,
                `${STORAGE_USER_PROFILEPIC_KEY}/${
                    crypto.randomUUID() + state.profilePic.name
                }`
            );

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
                    console.log(context.loggedInUser.photoURL);
                })
                .then(() => {
                    const displayNameOfUser = context.loggedInUser.displayName;
                    const emailOfUser = context.loggedInUser.email;
                    const timeOfCreation =
                        context.loggedInUser.metadata.creationTime;
                    const uID = context.loggedInUser.uid;
                    const profilePicURL = context.loggedInUser.photoURL;
                    const userInfo = {
                        displayName: displayNameOfUser,
                        email: emailOfUser,
                        timeCreated: timeOfCreation,
                        uid: uID,
                        reputation: 0,
                        photoURL: profilePicURL,
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

        if (state.profilePic == null) {
            alert("Please upload a profile picture");
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
        <Stack alignItems={"center"} justifyContent={"center"} my={5}>
            <Typography variant="h2">Hello there! 👋</Typography>
            <Typography variant="h4" my={2}>
                Welcome to the Bazzinga community!
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={2}
                >
                    <Typography variant="subtitle1">
                        How should we address you?
                    </Typography>
                    <TextField
                        required
                        size="small"
                        value={state.displayName}
                        id="displayName"
                        type="displayName"
                        label="Username"
                        onChange={handleChange}
                    ></TextField>
                    <Typography variant="subtitle1">
                        What do you look like?
                    </Typography>
                    <TextField
                        type="file"
                        onChange={handleFileChange}
                        size="small"
                        placeholder="Click here to submit an image"
                    />
                    <Button type="submit" variant="contained">
                        Submit
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
export default CreateProfile;
