import { Button, Paper, TextField, Typography } from "@mui/material";
import { ref as dbRef, push, set, update } from "firebase/database";
import { database } from "../../../firebase";
import React, { useState } from "react";

const DB_POSTS_KEY = "posts";

function CommentsSection({ selectedPost }) {
    const [commentInput, setCommentInput] = useState("");

    const addComments = (postKey) => {
        const commentRef = dbRef(
            database,
            `${DB_POSTS_KEY}/${postKey}/comments`
        );
        const newCommentRef = push(commentRef);

        set(newCommentRef, {
            text: commentInput,
            author: "Timothy",
        });
    };

    const handleChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addComments(selectedPost.key);
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
            return (
                <Paper key={key}>
                    <Typography variant="body1">
                        {selectedPost.comments[key].text}
                    </Typography>
                    <Typography variant="overline">
                        {selectedPost.comments[key].author}
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
                />
            </form>
            {commentRender}
        </>
    );
}

export default CommentsSection;
