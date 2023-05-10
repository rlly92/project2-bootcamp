import React, { useState, useEffect, useContext } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    getAuth,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";

const SignUpPage = () => {
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

        toast
            .promise(
                createUserWithEmailAndPassword(
                    auth,
                    state.emailInput,
                    state.passwordInput
                ),
                {
                    pending: "Creating an account...",
                    success: "Successfully created an account!",
                    error: "Oops, something went wrong. Try again!",
                }
            )
            .then(() => {
                toast.success("🐝 Successfully created a new account!");
                setState({ emailInput: "", passwordInput: "" });
            })
            .then(() => {
                navigate("/createprofile");
            });
    };

    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
        console.log(state);
    };

    return (
        <Stack alignItems={"center"} justifyContent={"center"} my={5}>
            <Typography variant="h2">Join the band of bazzingers.</Typography>
            <Typography variant="subtitle1">
                We welcome you with open arms. *winky face*
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={2}
                    mt={2}
                >
                    <TextField
                        required
                        autoComplete="off"
                        value={state.emailInput}
                        size="small"
                        id="emailInput"
                        type="email"
                        label="Email"
                        onChange={handleChange}
                    ></TextField>
                    <TextField
                        required
                        autoComplete="off"
                        value={state.passwordInput}
                        size="small"
                        id="passwordInput"
                        type="password"
                        label="Password"
                        onChange={handleChange}
                    ></TextField>
                    <Button type="submit" variant="contained">
                        Sign Up
                    </Button>
                </Stack>
            </form>
            <br />
            <br />
            <Button variant="contained" color="secondary">
                Back to main
            </Button>
        </Stack>
    );
};

export default SignUpPage;
