import React, { useContext } from "react";
import { UserContext } from "../App";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Stack,
    Button,
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
                            // sx={{ width: "50%", m: 1 }}
                            onClick={bazzingaButton}
                            type="button"
                        >
                            BAZZINGA
                        </Button>
                    </Typography>

                    {context.loggedInUser != null ? (
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            {displayName}'s Favourite Bazaars
                        </Typography>
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
                        <SearchBar sx={{ width: "100%" }} />
                        {context.loggedInUser != null ? (
                            <Button
                                variant="contained"
                                // sx={{ width: "50%", m: 1 }}
                                onClick={handleLogOutAndNavigateToLogin}
                                type="button"
                            >
                                Log Out
                            </Button>
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
