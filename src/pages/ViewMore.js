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
import { ContentCopy } from "@mui/icons-material";

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
            <Box p={3}>
                <Stack direction={"row"} spacing={2}>
                    {userContext.loggedInUser != null && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBack}
                            startIcon={<ArrowBackIcon />}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCopy}
                        startIcon={<ContentCopy />}
                    >
                        Copy link to clipboard
                    </Button>
                </Stack>

                <Stack direction={"row"} spacing={5} my={2}>
                    <ViewMoreLeft selectedPost={selectedPost} />
                    <ViewMoreCenter selectedPost={selectedPost} />
                    <ViewMoreRight selectedPost={selectedPost} />
                </Stack>
            </Box>
        );
    else
        return (
            <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <CircularProgress color="secondary" />
            </Stack>
        );
}

export default ViewMore;
