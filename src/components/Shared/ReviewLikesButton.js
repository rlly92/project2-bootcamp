import React, { useContext, useEffect, useState } from "react";
import { ref as dbRef, update } from "firebase/database";
import { database } from "../../firebase";
import {
    Button,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { UserContext } from "../../App";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const DB_POSTS_KEY = "posts";

function ReviewLikesButton({ postKey, review }) {
    const [status, setStatus] = useState("");

    const context = useContext(UserContext);

    useEffect(() => {
        if (context.loggedInUser == null) {
            setStatus("");
            return;
        } else if (review && review.likes[context.loggedInUser.uid])
            setStatus("liked");
        else setStatus("");
    }, [context.loggedInUser, review]);

    const updateLikes = (postKey, reviewKey) => {
        const likesRef = dbRef(
            database,
            `${DB_POSTS_KEY}/${postKey}/reviews/${reviewKey}`
        );

        if (review.likes[context.loggedInUser.uid] === true) {
            let updates = { ...review.likes };
            delete updates[context.loggedInUser.uid];
            if (Object.keys(updates).length === 0) updates = 0;

            update(likesRef, {
                likes: updates,
            });
            return;
        }

        if (review.likes === 0) {
            update(likesRef, {
                likes: {
                    [context.loggedInUser.uid]: true,
                },
            });
            return;
        }

        update(likesRef, {
            likes: {
                ...review.likes,
                [context.loggedInUser.uid]: true,
            },
        });
    };

    const handleLike = () => {
        updateLikes(postKey, review.key);

        if (status === "liked") {
            setStatus("");
            return;
        }

        setStatus("liked");
    };

    let LikesInNumber;

    if (review.likes === 0) LikesInNumber = 0;
    else LikesInNumber = Object.keys(review.likes).length;

    if (context.loggedInUser == null) return <CircularProgress />;

    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            // justifyContent={"center"}
        >
            <IconButton
                disabled={context.loggedInUser == null ? true : false}
                onClick={handleLike}
                type="button"
            >
                {status === "liked" ? (
                    <FavoriteIcon color="error" />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>
            {LikesInNumber === 0 && (
                <Typography variant="subtitle2">
                    This post hasn't been liked yet. Be the first!
                </Typography>
            )}
            {LikesInNumber === 1 && (
                <Typography variant="subtitle2">
                    1 person found this review helpful.
                </Typography>
            )}
            {LikesInNumber > 1 && (
                <Typography variant="subtitle2">
                    {LikesInNumber} people found this review helpful.
                </Typography>
            )}
        </Stack>
    );
}

export default ReviewLikesButton;
