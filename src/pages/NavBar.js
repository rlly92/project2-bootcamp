import React, { useContext } from "react";
import { UserContext } from "../App";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Stack,
    Button,
    Avatar,
} from "@mui/material";
import SearchBar from "./UserSearchBar";
import { useNavigate, Outlet } from "react-router-dom";

const NavBar = ({ handleLogOut }) => {
    const navigate = useNavigate();

    const context = useContext(UserContext);
    const displayName = context.loggedInUser
        ? context.loggedInUser.displayName
        : "";

    const handleLogOutAndNavigateToLogin = () => {
        handleLogOut();
    };
    const signUpButton = () => {
        navigate("/login/signup");
    };
    const bazzingaButton = () => {
        navigate("/");
    };

    const handleProfileClick = () => {
        navigate(`/user/${displayName}`);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        <Button
                            variant="contained"
                            onClick={bazzingaButton}
                            type="button"
                            disableElevation
                        >
                            <Typography
                                variant="h5"
                                sx={{ fontFamily: "'Yeseva One', cursive" }}
                            >
                                bazzinga!
                            </Typography>
                        </Button>
                    </Typography>

                    {context.loggedInUser != null ? (
                        ""
                    ) : (
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            BAZAAR IS LOVE. BAZAAR IS LIFE.
                        </Typography>
                    )}

                    <Stack direction="row" spacing={2}>
                        {context.loggedInUser != null ? (
                            <Stack direction="row" spacing={2}>
                                <SearchBar sx={{ width: "100%" }} />
                                <Button
                                    variant="contained"
                                    onClick={handleProfileClick}
                                    type="button"
                                    disableElevation
                                    startIcon={
                                        <Avatar
                                            src={context.loggedInUser.photoURL}
                                        />
                                    }
                                >
                                    {displayName}
                                </Button>

                                <Button
                                    variant="contained"
                                    disableElevation
                                    onClick={handleLogOutAndNavigateToLogin}
                                    type="button"
                                >
                                    Log Out
                                </Button>
                            </Stack>
                        ) : (
                            <Button
                                variant="contained"
                                // sx={{ width: "50%", m: 1 }}
                                onClick={signUpButton}
                                type="button"
                            >
                                Sign Up
                            </Button>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>
            <Outlet />
        </>
    );
};

export default NavBar;
