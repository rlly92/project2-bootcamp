import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ref as dbRef, push } from "firebase/database";
import { UserContext } from "../App";
import { UserInfoContext } from "../components/UserInfoContext/UserInfoProvider";
import { ref as storageRef } from "firebase/storage";
import { database, storage } from "../firebase";
import Image from "mui-image";
import { Paper, Stack, Typography } from "@mui/material";

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
    console.log(userInfoData.userInfo);

    const { username } = useParams();

    useEffect(() => {
        if (context.loggedInUser == null) {
            navigate("/");
        }
    }, [context.loggedInUser]);

    // use username to filter through the userInfoData and find and then store
    // the current user's data in currentUserData so that it can be rendered

    let timeCreated;

    const profilePic = () => {
        const currentUser = userInfoData.userInfo.find(
            (user) => user.displayName === username
        );

        console.log(currentUser);

        if (currentUser == null) {
            return <h1>Loading...</h1>;
        } else if (currentUser && currentUser.photoURL) {
            timeCreated = currentUser.timeCreated;
            return (
                <img
                    src={currentUser.photoURL}
                    showLoading
                    style={{
                        maxHeight: "300px",
                        aspectRatio: "1",
                        objectFit: "contain",
                        borderRadius: "10px",
                    }}
                    alt=""
                />
            );
        } else {
            return <h1>No profile pic found</h1>;
        }
    };

    const userInfoRef = dbRef(database, DB_USERINFO_KEY);
    const userProfilePicRef = storageRef(storage, STORAGE_USER_PROFILEPIC_KEY);

    return (
        <Stack alignItems={"center"} justifyContent={"center"} mt={5}>
            <Paper sx={{ width: "50%", py: 4, px: 3 }}>
                <Stack direction={"row"} spacing={3}>
                    {profilePic()}
                    <Stack>
                        <Typography variant="h2">@{username}</Typography>
                        <Typography variant="subtitle1">
                            Date joined: {timeCreated}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default UserProfilePage;
