import { Box, Typography } from "@mui/material";
import React from "react";

import CommentsSection from "../Sidebar/SideInfo/CommentsSection";

import ChipsSection from "./ViewMoreCenter/ChipsSection";
import Lightbox from "../Lightbox/Lightbox";

function ViewMoreCenter({ selectedPost }) {
    let urlArray = Object.values(selectedPost.images);

    return (
        <Box flex={3}>
            <Typography variant="h5">
                Here's what to expect of this event: 🍃
            </Typography>
            <ChipsSection tags={selectedPost.tags} postKey={selectedPost.key} />
            <br />
            <Typography variant="h5">Photo gallery 🤳</Typography>
            <Box height={"50vh"} sx={{ overflowY: "scroll" }}>
                <Lightbox urlArray={urlArray} />
            </Box>
            <br />
            <Typography variant="h5">Drop a comment! 💌</Typography>
            <Typography variant="body1">
                Will you be visiting soon? Let the rest of us know!
            </Typography>
            <CommentsSection
                selectedPost={selectedPost}
                loadLocation="viewmore"
            />
        </Box>
    );
}

export default ViewMoreCenter;
