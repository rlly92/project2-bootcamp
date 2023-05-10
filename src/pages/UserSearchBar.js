import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/system";
import { UserContext } from "../App";
import { UserInfoContext } from "../components/UserInfoContext/UserInfoProvider";

function SearchBar() {
    const [state, setState] = useState([{ username: "" }]);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    // current user context:
    // const context = useContext(UserContext);

    // context for database of users and the data of each user within that database:
    const userInfoData = useContext(UserInfoContext);

    console.log(userInfoData.userInfo);

    // const handleChange = (e) => {
    //     setState({ ...state.username, [e.target.id]: e.target.value });
    //     console.log(state);
    // };

    function handleUserSelection(username) {
        // Navigate to the page that conditionally renders user data based on the selected username

        navigate(`/user/${username}`);
    }
    return (
        <div>
            <Stack sx={{ width: 300, margin: "auto" }}>
                <Autocomplete
                    id="displayName"
                    getOptionLabel={(option) => option.displayName}
                    options={userInfoData.userInfo}
                    sx={{ width: 300 }}
                    isOptionEqualToValue={(option, value) =>
                        option.displayName === value.displayName
                    }
                    noOptionsText={"NO USERS CAN BE FOUND"}
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            {...props}
                            key={option.displayName}
                            onClick={() =>
                                handleUserSelection(option.displayName)
                            }
                        >
                            {option.displayName}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search for other users!"
                        />
                    )}
                />
            </Stack>
        </div>
    );
}

export default SearchBar;
