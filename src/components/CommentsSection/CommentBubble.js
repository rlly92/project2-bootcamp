import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ref as dbRef, update } from "firebase/database";
import React, { useState } from "react";

import { toast } from "react-toastify";
import { database } from "../../firebase";

function CommentBubble({
    author,
    authorUid,
    text,
    date,
    loggedInUser,
    postKey,
    commentKey,
}) {
    const [editMode, setEditMode] = useState(false);
    const [textInput, setTextInput] = useState(text);

    const handleDelete = (postKey, commentKey) => {
        const commentRef = dbRef(database, `posts/${postKey}/comments`);

        toast.promise(
            update(commentRef, {
                [commentKey]: null,
            }),
            {
                pending: "Uploading in progress...",
                success: "Comment deleted!",
                error: "Error! 🤔",
            }
        );
        console.log("deletion");
    };

    const handleChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const commentRef = dbRef(database, `posts/${postKey}/comments`);

        toast.promise(
            update(commentRef, {
                [commentKey]: {
                    author,
                    authorUid,
                    date,
                    text: textInput,
                },
            }),
            {
                pending: "Uploading in progress...",
                success: "Comment edited!",
                error: "Error! 🤔",
            }
        );

        setEditMode(false);
    };

    return (
        <Paper sx={{ py: 1, px: 2, my: 1 }}>
            {editMode === false && (
                <>
                    <Typography variant="h6">@{author}</Typography>
                    <Typography variant="body1">{text}</Typography>
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Typography
                            variant="overline"
                            sx={{ fontSize: "10px" }}
                        >
                            {formatDistanceToNow(new Date(date))} ago
                        </Typography>
                        {loggedInUser && loggedInUser.uid === authorUid ? (
                            <Box>
                                <Button onClick={() => setEditMode(true)}>
                                    Edit
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleDelete(postKey, commentKey)
                                    }
                                >
                                    Delete
                                </Button>
                            </Box>
                        ) : (
                            ""
                        )}
                    </Stack>
                </>
            )}
            {editMode === true && (
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        name="commentInput"
                        placeholder="Type your new comment"
                        variant="outlined"
                        size="small"
                        value={textInput}
                        onChange={handleChange}
                        fullWidth
                        multiline
                    />
                    <Button type="submit">Confirm Edit</Button>
                </form>
            )}
        </Paper>
    );
}

export default CommentBubble;
