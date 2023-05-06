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

    const handleLogOutAndNavigate = () => {
        handleLogOut().then(() => navigate("/login"));
    };
    const signUpButton = () => {
        navigate("/login/signup");
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton size='large' edge='start' aria-label='logo' color='inherit'>

</IconButton> */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        BAZZINGA
                    </Typography>
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
