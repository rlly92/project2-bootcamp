import React, { useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Button, Stack, TextField, Typography } from "@mui/material";

const LoginPage = () => {
    const [state, setState] = useState({ emailInput: "", passwordInput: "" });
    const navigate = useNavigate();

    const context = useContext(UserContext);

    useEffect(() => {
        if (context.loggedInUser != null) {
            navigate("/");
        }
    }, [context.loggedInUser]);

    const handleSubmit = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, state.emailInput, state.passwordInput)
            .then((userCredential) => {
                console.log("somebody has signed in");
            })

            .then(() => {
                setState({ emailInput: "", passwordInput: "" });
            })
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.log("theres is an error signing in");
            });
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    return (
        <Stack alignItems={"center"} justifyContent={"center"} my={5}>
            <Typography variant="h2">Join the band of bazzingers.</Typography>
            <form onSubmit={handleSubmit}>
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={2}
                    mt={2}
                >
                    <TextField
                        required
                        size="small"
                        label="Email"
                        value={state.emailInput}
                        name="emailInput"
                        type="email"
                        onChange={handleChange}
                    ></TextField>
                    <TextField
                        required
                        size="small"
                        value={state.passwordInput}
                        name="passwordInput"
                        type="password"
                        label="Password"
                        onChange={handleChange}
                    ></TextField>
                    <Button type="submit" variant="contained">
                        Login
                    </Button>
                    <br />
                    <Typography variant="h4">
                        Not part of the community yet?
                    </Typography>
                    <Link to="signup">
                        <Button variant="contained">sign up</Button>
                    </Link>
                </Stack>
            </form>
        </Stack>
    );
};

export default LoginPage;
