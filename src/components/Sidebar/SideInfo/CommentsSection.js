import {
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { ref as dbRef, push, set } from "firebase/database";
import { database } from "../../../firebase";
import React, { useContext, useState } from "react";

import { UserContext } from "../../../App";

import { Send } from "@mui/icons-material";

import CommentBubble from "../../CommentsSection/CommentBubble";
import { useNavigate } from "react-router-dom";

const DB_POSTS_KEY = "posts";

function CommentsSection({ selectedPost, loadLocation }) {
    const [commentInput, setCommentInput] = useState("");
    const navigate = useNavigate();

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
    else if (selectedPost.comments !== 0 && loadLocation === "viewmore")
        commentRender = Object.keys(selectedPost.comments)
            .reverse()
            .map((key) => {
                let comment = selectedPost.comments[key];
                return (
                    <CommentBubble
                        key={key}
                        author={comment.author}
                        authorUid={comment.authorUid}
                        text={comment.text}
                        date={comment.date}
                        loggedInUser={context.loggedInUser}
                        postKey={selectedPost.key}
                        commentKey={key}
                    />
                );
            });
    else if (
        selectedPost.comments !== 0 &&
        loadLocation === "home" &&
        Object.keys(selectedPost.comments).length > 5
    )
        commentRender = (
            <>
                <Typography variant="overline">
                    Showing 5 latest posts
                </Typography>
                {Object.keys(selectedPost.comments)
                    .reverse()
                    .slice(0, 5)
                    .map((key) => {
                        let comment = selectedPost.comments[key];
                        return (
                            <CommentBubble
                                key={key}
                                author={comment.author}
                                authorUid={comment.authorUid}
                                text={comment.text}
                                date={comment.date}
                                loggedInUser={context.loggedInUser}
                                postKey={selectedPost.key}
                                commentKey={key}
                            />
                        );
                    })}
                <Button onClick={() => navigate(`/post/${selectedPost.key}`)}>
                    View {Object.keys(selectedPost.comments).length - 5} more
                    comments
                </Button>
            </>
        );
    else if (
        selectedPost.comments !== 0 &&
        loadLocation === "home" &&
        Object.keys(selectedPost.comments).length <= 5
    )
        commentRender = (
            <>
                {Object.keys(selectedPost.comments)
                    .reverse()
                    .slice(0, 5)
                    .map((key) => {
                        let comment = selectedPost.comments[key];
                        return (
                            <CommentBubble
                                key={key}
                                author={comment.author}
                                authorUid={comment.authorUid}
                                text={comment.text}
                                date={comment.date}
                                loggedInUser={context.loggedInUser}
                                postKey={selectedPost.key}
                                commentKey={key}
                            />
                        );
                    })}
            </>
        );

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    required
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
            {loadLocation === "viewmore" && (
                <Typography variant="overline">End of comments list</Typography>
            )}
        </>
    );
}

export default CommentsSection;
