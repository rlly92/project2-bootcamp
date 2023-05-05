import React, { useState, useEffect, useContext } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function CreateProfile() {
    const navigate = useNavigate();
    const [state, setState] = useState({ displayName: "" });
    const context = useContext(UserContext);

    // useEffect(() => {
    //     if (context.loggedInUser != null) {
    //         navigate("/login");
    //     }
    // }, [context.loggedInUser]);

    const addUserName = (displayName) => {
        const auth = getAuth();
        const user = auth.currentUser;

        return updateProfile(user, {
            displayName,
        })
            .then(() => {
                console.log("Profile updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
