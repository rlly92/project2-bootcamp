import React, { useState, useEffect, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

import {
    ref as dbRef,
    push,
    query,
    orderByChild,
    equalTo,
    get,
} from "firebase/database";
import { database } from "../firebase";

const DB_USERINFO_KEY = "user_info";

function CreateProfile() {
    const navigate = useNavigate();
    const [state, setState] = useState({ displayName: "" });
    const context = useContext(UserContext);
    const userInfoRef = dbRef(database, DB_USERINFO_KEY);

    useEffect(() => {
        if (context.loggedInUser == null) {
            navigate("/");
        }
    }, [context.loggedInUser]);

    const addUserName = (displayName) => {
        return updateProfile(context.loggedInUser, {
            displayName,
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
                };
                push(userInfoRef, userInfo);
            })
            .then(() => {
                console.log("Profile updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    };

    const checkUsernameExists = async (username) => {
        const snapshot = await query(
            dbRef(database, DB_USERINFO_KEY),
            orderByChild("displayName"),
            equalTo(username),
            get("value")
        );
        return snapshot.exists();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = state.displayName;
        const usernameExists = await checkUsernameExists(username);

        if (usernameExists) {
            alert(
                "This username already exists. Please choose another username"
            );
        }
        if (state.displayName !== String(state.displayName).toLowerCase()) {
            alert("Invalid input. Please input only lowercase letter.");
            return;
        }
        addUserName(state.displayName).then(() => {
            navigate("/");
        });
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

                <button type="submit">Submit Username</button>
            </form>
        </div>
    );
}
export default CreateProfile;
