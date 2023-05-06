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
import { useNavigate, Outlet } from "react-router-dom";

const NavBar = ({ handleLogOut }) => {
    const navigate = useNavigate();

    const context = useContext(UserContext);
    // const displayName = context.loggedInUser.displayName;

    const handleLogOutAndNavigate = () => {
        handleLogOut().then(() => navigate("/login"));
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
                            sx={{ width: "50%", m: 1 }}
                            onClick={bazzingaButton}
                            type="button"
                        >
                            BAZZINGA
                        </Button>
                    </Typography>
                    {/* CONDITIONAL LOGIC FOR ADDING DISPLAYNAME TO NAVBAR APPEARS HERE WHEN DISPLAYNAME IS POPULATED */}
                    {/* {displayName != null ? (
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            WELCOME BACK {displayName}
                        </Typography>
                    ) : ( */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        BAZAAR IS LOVE. BAZAAR IS LIFE.
                    </Typography>
                    {/* )} */}
                    <Stack direction="row" spacing={2}>
                        {context.loggedInUser != null ? (
                            <Button
                                variant="contained"
                                sx={{ width: "50%", m: 1 }}
                                onClick={handleLogOutAndNavigate}
                                type="button"
                            >
                                Log Out
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{ width: "50%", m: 1 }}
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
