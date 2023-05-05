import { Button, Paper, TextField, Typography } from "@mui/material";
import { ref as dbRef, push, set, update } from "firebase/database";
import { database } from "../../../firebase";
import React, { useContext, useState } from "react";

import { UserContext } from "../../../App";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const DB_POSTS_KEY = "posts";

function CommentsSection({ selectedPost }) {
    const [commentInput, setCommentInput] = useState("");

    const context = useContext(UserContext);

    const addComments = (postKey) => {
        const commentRef = dbRef(
            database,
            `${DB_POSTS_KEY}/${postKey}/comments`
        );
        const newCommentRef = push(commentRef);

        set(newCommentRef, {
            text: commentInput,
            author: context.loggedInUser.displayName,
            authorUid: context.loggedInUser.uid,
            date: Date.now(),
        });
    };

    const handleChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addComments(selectedPost.key);

        setCommentInput("");
    };

    let commentRender;
    if (selectedPost == null) commentRender = "";
    else if (selectedPost.comments === 0)
        commentRender = (
            <>
                <Typography variant="body1">It's empty here.</Typography>
            </>
        );
    else if (selectedPost.comments !== 0)
        commentRender = Object.keys(selectedPost.comments).map((key) => {
            let comment = selectedPost.comments[key];
            return (
                <Paper key={key}>
                    <Typography variant="body1">{comment.text}</Typography>
                    <Typography variant="overline">
                        Posted by {comment.author}{" "}
                        {formatDistanceToNow(new Date(comment.date))} ago
                    </Typography>
                </Paper>
            );
        });

    return (
        <>
            <Typography variant="h6">Comments:</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="commentInput"
                    placeholder="Share your thoughts"
                    variant="outlined"
                    size="small"
                    value={commentInput}
                    onChange={handleChange}
                    fullWidth
                    multiline
                />
            </form>
            {commentRender}
        </>
    );
}

export default CommentsSection;
