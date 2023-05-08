import {
    Button,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { ref as dbRef, push, set, update } from "firebase/database";
import { database } from "../../../firebase";
import React, { useContext, useState } from "react";

import { UserContext } from "../../../App";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Send } from "@mui/icons-material";

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
        commentRender = Object.keys(selectedPost.comments)
            .reverse()
            .map((key) => {
                let comment = selectedPost.comments[key];
                return (
                    <Paper key={key} sx={{ py: 1, px: 2, my: 1 }}>
                        <Typography variant="h6">{comment.author}</Typography>
                        <Typography variant="body1">{comment.text}</Typography>
                        <Typography
                            variant="overline"
                            sx={{ fontSize: "10px" }}
                        >
                            {formatDistanceToNow(new Date(comment.date))} ago
                        </Typography>
                    </Paper>
                );
            });

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    sx={{ my: 2 }}
                    name="commentInput"
                    placeholder="Share your thoughts"
                    variant="outlined"
                    size="small"
                    value={commentInput}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    disabled={context.loggedInUser == null ? true : false}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    disabled={
                                        context.loggedInUser == null
                                            ? true
                                            : false
                                    }
                                    type="submit"
                                    size="small"
                                >
                                    <Send fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
            {commentRender}
        </>
    );
}

export default CommentsSection;
