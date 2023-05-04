import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [state, setState] = useState({ emailInput: "", passwordInput: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, state.emailInput, state.passwordInput)
      .then(() => {
        setState({ emailInput: "", passwordInput: "" });
      })
      .then(() => {
        navigate("/home");
      });
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.id]: e.target.value });
    console.log(state);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={state.emailInput}
          id="emailInput"
          type="email"
          placeholder="enter your email here"
          onChange={handleChange}
        ></input>
        <input
          value={state.passwordInput}
          id="passwordInput"
          type="password"
          placeholder="give me your password"
          onChange={handleChange}
        ></input>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
