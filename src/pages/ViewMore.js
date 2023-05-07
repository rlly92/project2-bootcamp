import { Paper, Typography } from "@mui/material";
import React, { useContext } from "react";
import { currentPostContext } from "../components/CurrentPostContext/CurrentPostProvider";
import LikesDislikesBar from "../components/Sidebar/SideInfo/LikesDislikesBar";
import format from "date-fns/format";
import ChipsArray from "../components/Sidebar/SideInfo/ChipsArray";
import CommentsSection from "../components/Sidebar/SideInfo/CommentsSection";

function ViewMore() {
    const context = useContext(currentPostContext);
    let selectedPost = context.currentPost;

    return (
        <Typography variant="h1">
            <Paper
                sx={{
                    py: 3,
                    px: 1,
                    width: "100%",
                }}
            >
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

                <Typography variant="h5">
                    📍 {selectedPost.geocodeName}
                </Typography>

                <Typography variant="h6">
                    From{" "}
                    {format(new Date(selectedPost.duration.startDate), "PPP")}{" "}
                    to {format(new Date(selectedPost.duration.endDate), "PPP")}
                </Typography>

                <Typography variant="body2">
                    Type: {selectedPost.type}
                </Typography>

                <Typography>Tags:</Typography>
                <ChipsArray tags={selectedPost.tags} />

                <CommentsSection selectedPost={selectedPost} />
            </Paper>
        </Typography>
    );
}

export default ViewMore;
