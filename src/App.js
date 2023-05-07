import "bootstrap/dist/css/bootstrap.min.css";
import React, { createContext, useEffect, useState } from "react";

import { auth } from "./firebase";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { ref as dbRef } from "firebase/database";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CreateProfile from "./pages/CreateProfile";
import NavBar from "./pages/NavBar";
import CurrentPostProvider from "./components/CurrentPostContext/CurrentPostProvider";
import ViewMore from "./pages/ViewMore";

const DB_USERINFO_KEY = "user_info";
export const UserContext = createContext();

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [currentUserInfo, setUserInfo] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user is signed in");
                setLoggedInUser(user);
            } else {
                console.log("no user currently signed in");
                setLoggedInUser(null);
            }
        });
    }, []);

    console.log(loggedInUser);

    function RequireAuth({ children, redirectTo, user }) {
        return user != null ? children : <Navigate to={redirectTo} />;
    }

    const handleLogOut = () => {
        return new Promise((res, rej) => {
            res(
                signOut(auth).then(() => {
                    setLoggedInUser(null);
                })
            );
        });
    };

    const context = {
        loggedInUser,
        setLoggedInUser,
    };

    return (
        <div className="App">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
            />
            <UserContext.Provider value={context}>
                <CurrentPostProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={<NavBar handleLogOut={handleLogOut} />}
                            >
                                <Route
                                    index
                                    element={
                                        <RequireAuth
                                            redirectTo="login"
                                            user={loggedInUser}
                                        >
                                            <Home handleLogOut={handleLogOut} />
                                        </RequireAuth>
                                    }
                                />

                                <Route path="login" element={<LoginPage />} />

                                <Route
                                    path="/login/signup"
                                    element={<SignUpPage />}
                                />

                                <Route
                                    path="createprofile"
                                    element={<CreateProfile />}
                                />

                                <Route path="/post" element={<ViewMore />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </CurrentPostProvider>
            </UserContext.Provider>
        </div>
    );
};

export default App;
