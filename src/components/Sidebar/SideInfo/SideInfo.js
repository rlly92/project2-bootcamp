import { Button, Paper, Typography } from "@mui/material";
import format from "date-fns/format";
import React, { useContext } from "react";
import LikesDislikesBar from "./LikesDislikesBar";
import CommentsSection from "./CommentsSection";
import ImageCarousel from "./ImageCarousel";
import ChipsArray from "./ChipsArray";

import { currentPostContext } from "../../CurrentPostContext/CurrentPostProvider";
import { useNavigate } from "react-router-dom";

function SideInfo({ selectedPost }) {
    const context = useContext(currentPostContext);
    const navigate = useNavigate();

    const handleViewMore = () => {
        navigate(`/post/${selectedPost.key}`);
    };

    return (
        <Paper
            sx={{
                py: 3,
                px: 1,
                width: "100%",
            }}
        >
            <Button onClick={handleViewMore}>View More</Button>
            <Typography variant="h4">{selectedPost.eventName}</Typography>

            <Typography variant="subtitle2">
                Posted by {selectedPost.authorDisplayName} on{" "}
                {new Date(selectedPost.date).toLocaleString("en-SG")}
            </Typography>

            <LikesDislikesBar selectedPost={selectedPost} />

            {selectedPost.website ? (
                <Typography variant="body2">
                    Homepage: {selectedPost.website}
                </Typography>
            ) : (
                <Typography variant="body2">
                    No website was provided.
                </Typography>
            )}

            <Typography variant="h5">📍 {selectedPost.geocodeName}</Typography>

            <Typography variant="h6">
                From {format(new Date(selectedPost.duration.startDate), "PPP")}{" "}
                to {format(new Date(selectedPost.duration.endDate), "PPP")}
            </Typography>

            <ImageCarousel selectedPost={selectedPost} />

            <Typography variant="body2">Type: {selectedPost.type}</Typography>

            <Typography>Tags:</Typography>
            <ChipsArray tags={selectedPost.tags} postKey={selectedPost.key} />

            <Typography variant="h5">Comments:</Typography>
            <CommentsSection selectedPost={selectedPost} loadLocation="home" />
        </Paper>
    );
}

export default SideInfo;
