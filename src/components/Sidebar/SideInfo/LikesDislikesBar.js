import React, { useContext, useEffect, useState } from "react";
import { ref as dbRef, update } from "firebase/database";
import { database } from "../../../firebase";
import { Button, Stack, Typography } from "@mui/material";
import {
    ThumbDownAlt,
    ThumbDownOffAlt,
    ThumbUpAlt,
    ThumbUpOffAlt,
} from "@mui/icons-material";
import { UserContext } from "../../../App";

const DB_POSTS_KEY = "posts";

function LikesDislikesBar({ selectedPost }) {
    const [status, setStatus] = useState("");

    const context = useContext(UserContext);

    useEffect(() => {
        console.log(selectedPost.likes);
        console.log(selectedPost.likes[context.loggedInUser.uid]);
        if (selectedPost !== 0 && selectedPost.likes[context.loggedInUser.uid])
            setStatus("liked");
        else if (
            selectedPost !== 0 &&
            selectedPost.dislikes[context.loggedInUser.uid]
        )
            setStatus("disliked");
        else setStatus("");
    }, [context.loggedInUser.uid, selectedPost]);

    const updateLikes = (postKey) => {
        const likesRef = dbRef(database, `${DB_POSTS_KEY}/${postKey}`);

        if (selectedPost.likes[context.loggedInUser.uid] === true) {
            let updates = { ...selectedPost.likes };
            delete updates[context.loggedInUser.uid];
            if (Object.keys(updates).length === 0) updates = 0;

            update(likesRef, {
                likes: updates,
            });
            return;
        }

        update(likesRef, {
            likes: {
                ...selectedPost.likes,
                [context.loggedInUser.uid]: true,
            },
        });
    };

    const updateDislikes = (postKey) => {
        const likesRef = dbRef(database, `${DB_POSTS_KEY}/${postKey}`);

        if (selectedPost.dislikes[context.loggedInUser.uid] === true) {
            let updates = { ...selectedPost.dislikes };
            delete updates[context.loggedInUser.uid];
            if (Object.keys(updates).length === 0) updates = 0;

            update(likesRef, {
                dislikes: updates,
            });
            return;
        }

        update(likesRef, {
            dislikes: {
                ...selectedPost.dislikes,
                [context.loggedInUser.uid]: true,
            },
        });
    };

    const handleLike = () => {
        updateLikes(selectedPost.key);

        if (status === "liked") {
            setStatus("");
            return;
        }

        setStatus("liked");
    };

    const handleDislike = () => {
        updateDislikes(selectedPost.key);

        if (status === "disliked") {
            setStatus("");
            return;
        }

        setStatus("disliked");
    };

    let LikesInNumber;
    let DislikesInNumber;

    if (selectedPost.likes === 0) LikesInNumber = 0;
    else LikesInNumber = Object.keys(selectedPost.likes).length;

    if (selectedPost.dislikes === 0) DislikesInNumber = 0;
    else DislikesInNumber = Object.keys(selectedPost.dislikes).length;

    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Button disabled={status === "disliked"} onClick={handleLike}>
                {status === "liked" ? <ThumbUpAlt /> : <ThumbUpOffAlt />}
            </Button>
            <Typography variant="body1">
                {LikesInNumber - DislikesInNumber}
            </Typography>
            <Button disabled={status === "liked"} onClick={handleDislike}>
                {status === "disliked" ? <ThumbDownAlt /> : <ThumbDownOffAlt />}
            </Button>
        </Stack>
    );
}

export default LikesDislikesBar;
