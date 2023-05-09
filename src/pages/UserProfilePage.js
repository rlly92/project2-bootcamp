import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { UserContext } from "../App";
import { UserInfoContext } from "../components/UserInfoContext/UserInfoProvider";

function UserProfilePage(props) {
    // const navigate = useNavigate();
    const [currentUserData, setCurrentUserData] = useState([]);

    // current user context:
    const context = useContext(UserContext);

    // context for database of users and the data of each user within that database:
    const userInfoData = useContext(UserInfoContext);

    const { username } = useParams();

    // use username to filter through the userInfoData and find and then store
    // the current user's data in currentUserData so that it can be rendered

    return (
        <div>
            <h1>Welcome to {username} 's page! Browse wisely.</h1>
            <img
                src={context.loggedInUser.photoURL}
                alt="Profile Picture"
                style={{ width: "300px", height: "300px" }}
            />
        </div>
    );
}

export default UserProfilePage;
