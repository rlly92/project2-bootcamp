import React, { useContext } from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

import { ref as dbRef, update } from "firebase/database";
import { database } from "../../../firebase";
import { UserContext } from "../../../App";
import { currentPostContext } from "../../CurrentPostContext/CurrentPostProvider";
import { CircularProgress } from "@mui/material";

const DB_POSTS_KEY = "posts";

const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function ChipsArray({ tags, postKey }) {
    const context = useContext(UserContext);

    let keysArray = Object.keys(tags);

    const updateLikes = (postKey, tagKey) => {
        const likesRef = dbRef(
            database,
            `${DB_POSTS_KEY}/${postKey}/tags/${tagKey}`
        );

        if (tags[tagKey].authorUid === context.loggedInUser.uid) return;

        if (tags[tagKey].likes[context.loggedInUser.uid] === true) {
            let updates = { ...tags[tagKey].likes };
            delete updates[context.loggedInUser.uid];
            if (Object.keys(updates).length === 0) updates = 0;

            update(likesRef, {
                likes: updates,
            });
            return;
        }

        if (tags[tagKey].likes === 0) {
            update(likesRef, {
                likes: {
                    [context.loggedInUser.uid]: true,
                },
            });
            return;
        }

        update(likesRef, {
            likes: {
                ...tags[tagKey].likes,
                [context.loggedInUser.uid]: true,
            },
        });
    };

    const handleClick = (postKey, tagKey) => {
        updateLikes(postKey, tagKey);
    };

    return (
        <Paper
            sx={{
                display: "flex",
                // justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
            }}
            component="ul"
            elevation={0}
        >
            {keysArray.map((key) => {
                return (
                    <ListItem key={key}>
                        <Chip
                            uid={tags[key].authorUid}
                            label={`${tags[key].text} · ${
                                Object.keys(tags[key].likes).length + 1
                            }`}
                            onClick={() => handleClick(postKey, key)}
                            variant={
                                tags[key].likes[context.loggedInUser.uid]
                                    ? "filled"
                                    : "outlined"
                            }
                        />
                    </ListItem>
                );
            })}
        </Paper>
    );
}
