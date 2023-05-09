import React, { useState, useContext } from "react";

import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";

function SearchBar() {
    const [state, setState] = useState({ username: "" });

    const handleChange = (e) => {
        setState({ ...state.username, [e.target.id]: e.target.value });
        console.log(state);
    };

    return (
        <div>
            <SearchIcon />
            <Input
                value={state.username}
                id="username"
                type="username"
                placeholder="Find other users"
                onChange={handleChange}
            />
        </div>
    );
}

export default SearchBar;
