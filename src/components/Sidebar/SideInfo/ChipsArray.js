import React, { useContext } from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import { ref as dbRef, update } from "firebase/database";
import { database } from "../../../firebase";
import { UserContext } from "../../../App";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";

const DB_POSTS_KEY = "posts";

const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function ChipsArray({ tags, postKey }) {
    // const [mode, setMode] = useState("view");

    const context = useContext(UserContext);

    // useEffect(() => {
    //     if (context.loggedInUser == null) setMode("view");
    // }, [context.loggedInUser]);

    if (tags === 0)
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
                component="div"
                elevation={0}
            >
                <Typography variant="body1">
                    No tags at this moment. 😥
                </Typography>
            </Paper>
        );

    let keysArray = Object.keys(tags);

    const updateLikes = (postKey, tagKey) => {
        const likesRef = dbRef(
            database,
            `${DB_POSTS_KEY}/${postKey}/tags/${tagKey}`
        );

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

    const deleteChip = (postKey, tagKey) => {
        const postRef = dbRef(database, `${DB_POSTS_KEY}/${postKey}`);

        if (Object.keys(tags).length === 1) {
            update(postRef, {
                tags: 0,
            });
            return;
        }

        const tagRef = dbRef(database, `${DB_POSTS_KEY}/${postKey}/tags`);

        update(tagRef, {
            [tagKey]: null,
        });
        console.log("deletion");
    };

    const handleClick = (postKey, tagKey) => {
        //case where you created it yourself, so why would you unlike it LOL
        if (tags[tagKey].authorUid === context.loggedInUser.uid) return;

        updateLikes(postKey, tagKey);
    };

    const handleDelete = (postKey, tagKey) => {
        if (Object.keys(tags[tagKey].likes).length > 4) {
            toast.warn("That tag is too helpful! Let's not delete it 😎");
            return;
        }

        deleteChip(postKey, tagKey);
    };

    return (
        <Paper
            sx={{
                display: "flex",
                // justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                my: 2,
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
                            onClick={
                                context.loggedInUser
                                    ? () => handleClick(postKey, key)
                                    : undefined
                            }
                            variant={
                                context.loggedInUser &&
                                tags[key].likes[context.loggedInUser.uid]
                                    ? "filled"
                                    : "outlined"
                            }
                            color={
                                context.loggedInUser &&
                                tags[key].likes[context.loggedInUser.uid]
                                    ? "primary"
                                    : "secondary"
                            }
                            onDelete={
                                context.loggedInUser &&
                                tags[key].authorUid === context.loggedInUser.uid
                                    ? () => handleDelete(postKey, key)
                                    : undefined
                            }
                        />
                    </ListItem>
                );
            })}
        </Paper>
    );
}
