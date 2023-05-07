import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import React, { useState } from "react";
import ChipsArray from "../Sidebar/SideInfo/ChipsArray";
import CommentsSection from "../Sidebar/SideInfo/CommentsSection";
import LightGallery from "lightgallery/react";

function ViewMoreCenter({ selectedPost }) {
    const [index, setIndex] = useState(-1);

    let urlArray = Object.values(selectedPost.images);
    const photos = [];
    for (let url of urlArray) {
        photos.push({ src: url });
    }
    console.log(photos);
    return (
        <Box flex={3}>
            <Typography variant="h5">
                Here's what to expect of this event:
            </Typography>
            <ChipsArray tags={selectedPost.tags} />
            <br />
            <Typography variant="h5">Photo gallery 🤳</Typography>
            <Box height={"50vh"} sx={{ overflowY: "scroll" }}>
                <LightGallery speed={500}>
                    {urlArray.map((url) => {
                        return (
                            <a href={url}>
                                <img
                                    alt=""
                                    src={url}
                                    style={{ height: "20vh" }}
                                    loading="lazy"
                                />
                            </a>
                        );
                    })}
                </LightGallery>
            </Box>
            <br />
            <Typography variant="h5">Drop a comment!</Typography>
            <Typography variant="body1">Are you visting soon?</Typography>
            <CommentsSection selectedPost={selectedPost} />
        </Box>
    );
}

export default ViewMoreCenter;
