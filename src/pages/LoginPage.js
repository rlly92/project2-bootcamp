import React, { useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={state.emailInput}
                    name="emailInput"
                    type="email"
                    placeholder="enter your email here"
                    onChange={handleChange}
                ></input>
                <input
                    value={state.passwordInput}
                    name="passwordInput"
                    type="password"
                    placeholder="give me your password"
                    onChange={handleChange}
                ></input>
                <button type="submit">Login</button>
                <br />
                <Link to="signup">sign up</Link>
            </form>
        </div>
    );
};

export default LoginPage;
