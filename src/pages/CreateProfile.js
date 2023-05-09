import React, { useState, useEffect, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { UserInfoContext } from "../components/UserInfoContext/UserInfoProvider";

import { ref as dbRef, push } from "firebase/database";
import { database } from "../firebase";

const DB_USERINFO_KEY = "user_info";

function CreateProfile() {
    const navigate = useNavigate();
    const [state, setState] = useState({ displayName: "" });
    const context = useContext(UserContext);

    const userInfoData = useContext(UserInfoContext);

    const userInfoRef = dbRef(database, DB_USERINFO_KEY);

    useEffect(() => {
        if (context.loggedInUser == null) {
            navigate("/");
        }
    }, [context.loggedInUser]);

    console.log(userInfoData);

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
                    reputation: 0,
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
