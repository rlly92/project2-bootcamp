import { Box, Paper, Typography } from "@mui/material";
import React from "react";

import CommentsSection from "../Sidebar/SideInfo/CommentsSection";

import ChipsSection from "./ViewMoreCenter/ChipsSection";
import Lightbox from "../Lightbox/Lightbox";
import AddPhoto from "./ViewMoreCenter/AddPhoto";

function ViewMoreCenter({ selectedPost }) {
    let urlArray = Object.values(selectedPost.images);

    return (
        <Box flex={3}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4">
                    Here's what to expect of this event: 🍃
                </Typography>
                <ChipsSection
                    tags={selectedPost.tags}
                    postKey={selectedPost.key}
                />
            </Paper>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4">Photo gallery 🤳</Typography>
                <Typography variant="subtitle1">
                    Leave your memories anonymously.
                </Typography>
                <Box
                    sx={{
                        overflowY: "auto",
                        maxHeight: "50vh",
                        mt: 2,
                        mb: 3,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <Lightbox urlArray={urlArray} />
                </Box>
                <AddPhoto selectedPost={selectedPost} />
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4">Drop a comment! 💌</Typography>
                <Typography variant="subtitle1">
                    Will you be visiting soon? Let the rest of us know!
                </Typography>
                <CommentsSection
                    selectedPost={selectedPost}
                    loadLocation="viewmore"
                />
            </Paper>
        </Box>
    );
}

export default ViewMoreCenter;
