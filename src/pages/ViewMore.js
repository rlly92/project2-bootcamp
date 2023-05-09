import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import React, { useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { currentPostContext } from "../components/CurrentPostContext/CurrentPostProvider";
import ViewMoreLeft from "../components/ViewMore/ViewMoreLeft";
import ViewMoreCenter from "../components/ViewMore/ViewMoreCenter";
import ViewMoreRight from "../components/ViewMore/ViewMoreRight";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserContext } from "../App";
import { toast } from "react-toastify";

function ViewMore() {
    const context = useContext(currentPostContext);
    const userContext = useContext(UserContext);
    const postId = useParams().postId;

    const navigate = useNavigate();

    const selectedPost = context.posts.find((post) => post.key === postId);
    const handleBack = () => {
        navigate("/");
    };

    const handleCopy = () => {
        const text = window.location.href;
        navigator.clipboard.writeText(text);

        toast.info("Copied to clipboard!");
    };

    if (context.posts.length !== 0 && selectedPost == null)
        navigate("/error", { replace: true });

    if (context.posts.length !== 0)
        return (
            <Box>
                {userContext.loggedInUser != null && (
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "orange" }}
                        onClick={handleBack}
                    >
                        <ArrowBackIcon />
                    </Button>
                )}
                <Button variant="contained" onClick={handleCopy}>
                    Copy to clipboard
                </Button>

                <Stack direction={"row"} spacing={5} p={3}>
                    <ViewMoreLeft selectedPost={selectedPost} />
                    <ViewMoreCenter selectedPost={selectedPost} />
                    <ViewMoreRight selectedPost={selectedPost} />
                </Stack>
            </Box>
        );
    else
        return (
            <>
                <Typography variant="h1">Loading...</Typography>
                <CircularProgress />
            </>
        );
}

export default ViewMore;
