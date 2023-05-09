import { CircularProgress, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { currentPostContext } from "../components/CurrentPostContext/CurrentPostProvider";
import ViewMoreLeft from "../components/ViewMore/ViewMoreLeft";
import ViewMoreCenter from "../components/ViewMore/ViewMoreCenter";
import ViewMoreRight from "../components/ViewMore/ViewMoreRight";

function ViewMore() {
    const context = useContext(currentPostContext);
    const postId = useParams().postId;

    const navigate = useNavigate();

    const selectedPost = context.posts.find((post) => post.key === postId);
    if (selectedPost == null) navigate("/error", { replace: true });

    if (context.posts.length !== 0)
        return (
            <Stack direction={"row"} spacing={5} p={3}>
                <ViewMoreLeft selectedPost={selectedPost} />
                <ViewMoreCenter selectedPost={selectedPost} />
                <ViewMoreRight selectedPost={selectedPost} />
            </Stack>
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
