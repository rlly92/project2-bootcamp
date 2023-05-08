import {
    Box,
    ImageList,
    ImageListItem,
    Paper,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import ChipsArray from "../Sidebar/SideInfo/ChipsArray";
import CommentsSection from "../Sidebar/SideInfo/CommentsSection";
import LightGallery from "lightgallery/react";
import ChipsSection from "./ViewMoreCenter/ChipsSection";

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
                <LightGallery speed={500}>
                    {urlArray.map((url) => {
                        return (
                            <a href={url} key={url}>
                                <img
                                    alt=""
                                    src={url}
                                    style={{
                                        height: "20vh",
                                        border: "3px solid red",
                                    }}
                                    loading="lazy"
                                />
                            </a>
                        );
                    })}
                </LightGallery>
            </Box>
            <br />
            <Typography variant="h5">Drop a comment! 💌</Typography>
            <Typography variant="body1">
                Will you be visiting soon? Let the rest of us know!
            </Typography>
            <CommentsSection selectedPost={selectedPost} />
        </Box>
    );
}

export default ViewMoreCenter;
