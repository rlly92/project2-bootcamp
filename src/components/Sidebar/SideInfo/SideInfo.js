import { Button, Paper, Typography } from "@mui/material";
import format from "date-fns/format";
import React, { useContext } from "react";
import { ThumbDownOffAlt, ThumbUpOffAlt } from "@mui/icons-material";
import { UserContext } from "../../../App";
import LikesDislikesBar from "./LikesDislikesBar";

function SideInfo({ selectedPost }) {
    return (
        <Paper sx={{ py: 3, px: 1, width: "100%" }}>
            <Typography variant="h4">{selectedPost.eventName}</Typography>
            <Typography variant="subtitle2">
                Posted by {selectedPost.author} on{" "}
                {new Date(selectedPost.date).toLocaleString("en-SG")}
            </Typography>
            <LikesDislikesBar selectedPost={selectedPost} />
            <Typography variant="body2">
                Homepage: {selectedPost.website}
            </Typography>
            <Typography variant="h5">📍 {selectedPost.geocodeName}</Typography>
            <Typography variant="h6">
                From {format(new Date(selectedPost.duration.startDate), "PPP")}{" "}
                to {format(new Date(selectedPost.duration.endDate), "PPP")}
            </Typography>
            <Typography variant="body2">Type: {selectedPost.type}</Typography>
            <Typography>Tags:</Typography>
            <Typography>Comments: {selectedPost.comments}</Typography>
        </Paper>
    );
}

export default SideInfo;
