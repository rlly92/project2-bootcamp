import { CircularProgress, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";

import { useParams } from "react-router-dom";
import { currentPostContext } from "../components/CurrentPostContext/CurrentPostProvider";
import ViewMoreLeft from "../components/ViewMore/ViewMoreLeft";
import ViewMoreCenter from "../components/ViewMore/ViewMoreCenter";
import ViewMoreRight from "../components/ViewMore/ViewMoreRight";

function ViewMore() {
    const context = useContext(currentPostContext);
    console.log(context);
    const postId = useParams().postId;

    const selectedPost = context.posts.find((post) => post.key === postId);
    console.log(selectedPost);

    if (context.posts.length !== 0)
        return (
            <Stack direction={"row"} spacing={2} p={3}>
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
