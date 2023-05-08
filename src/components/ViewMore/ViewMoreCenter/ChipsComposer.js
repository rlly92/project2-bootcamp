import { Button } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../App";

import { ref as dbRef, push, set, update } from "firebase/database";
import { database, storage } from "../../../firebase";
import { toast } from "react-toastify";

function ChipsComposer({ tags, postKey, setMode }) {
    const [tagsInput, setTagsInput] = useState(["♿ Wheelchair Accessible"]);

    const [tagsErrorText, setTagsErrorText] = useState("");

    const context = useContext(UserContext);

    const makeArrIntoObj = (arr) => {
        const newObj = {};
        arr.forEach((item) => {
            newObj[crypto.randomUUID()] = {
                authorUid: context.loggedInUser.uid,
                text: item,
                likes: 0,
            };
        });
        return newObj;
    };

    const writeData = async (newRef, newTagsObj) => {
        try {
            await update(newRef, {
                tags: {
                    ...tags,
                    ...newTagsObj,
                },
            });

            toast.success("Successfully added to database!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (error) {
            toast.error("Oops, something went wrong. Try again!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            throw new Error(error);
        }
    };

    const handleTagsChange = (newTags) => {
        setTagsErrorText("");
        setTagsInput(newTags);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let haveError = false;

        // check tags
        if (tagsInput.length < 1) {
            setTagsErrorText("Enter at least 1 feature please!");
            haveError = true;
        }

        if (haveError) return;

        const postRef = dbRef(database, `posts/${postKey}`);
        // const newPostRef = push(postListRef);
        // const newPostKey = newPostRef.key;
        const tagsObj = makeArrIntoObj(tagsInput);

        await writeData(postRef, tagsObj);

        setMode("view");
    };

    return (
        <form onSubmit={handleSubmit}>
            <MuiChipsInput
                size="small"
                value={tagsInput}
                onChange={handleTagsChange}
                clearInputOnBlur
                error={tagsErrorText ? true : false}
                helperText={
                    tagsErrorText
                        ? tagsErrorText
                        : "What are some features of the event?"
                }
            />
            <Button type="submit">Submit</Button>
            <Button type="button">Cancel</Button>
        </form>
    );
}

export default ChipsComposer;
