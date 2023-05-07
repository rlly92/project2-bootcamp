import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React, { useState, useContext } from "react";

import { UserContext } from "../../App";

import { ref as dbRef, push, set } from "firebase/database";
import { database, storage } from "../../firebase";
import { toast } from "react-toastify";
import { MuiFileInput } from "mui-file-input";
import { MuiChipsInput } from "mui-chips-input";
import {
    ref as sRef,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import isBefore from "date-fns/isBefore";

const DB_POSTS_KEY = "posts";
const STORAGE_IMAGES_KEY = "images";

const typeOptions = [{ value: "Pasar Malam" }, { value: "Pop Up Store" }];

/* <TextField id="outlined-basic" label="name" variant="outlined" size="small" />; */

function BazaarForm({ geocodeName, markerCoords, clearForm }) {
    const [formInputs, setFormInputs] = useState({
        eventName: "",
        website: "",
        startDate: "",
        endDate: "",
        type: "",
        tags: "",
    });

    const [file, setFile] = useState([]);
    const [tags, setTags] = useState([
        "🅿 Easy Parking",
        "👪 Family Friendly",
        "✨ Great Atmosphere",
    ]);

    const [fileErrorText, setFileErrorText] = useState("");
    const [tagsErrorText, setTagsErrorText] = useState("");

    const context = useContext(UserContext);

    const uploadFile = async (files, postKey) => {
        if (files == null) return 0;

        let images = {};

        await Promise.all(
            files.map(async (image, index) => {
                const imageRef = sRef(
                    storage,
                    `${STORAGE_IMAGES_KEY}/${postKey}/${image.name}`
                );
                await uploadBytesResumable(imageRef, image);
                let imageURL = await getDownloadURL(imageRef);
                images[crypto.randomUUID()] = imageURL;
                console.log(images);

                toast.success(
                    `Successfully uploaded image! (${index + 1}/${
                        files.length
                    })`,
                    {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }
                );
            })
        );
        console.log(images);
        return images;
    };

    const makeArrIntoObj = (arr) => {
        const newObj = {};
        arr.forEach((item) => {
            newObj[crypto.randomUUID()] = {
                authorUid: context.loggedInUser.uid,
                text: item,
            };
        });
        return newObj;
    };

    const writeData = async (imageObj, newPostRef, tagsObj) => {
        try {
            await set(newPostRef, {
                eventName: formInputs.eventName,
                geocodeName: geocodeName,
                website: formInputs.website,
                coords: {
                    lat: markerCoords.toJSON().lat,
                    lng: markerCoords.toJSON().lng,
                },
                duration: {
                    startDate: formInputs.startDate,
                    endDate: formInputs.endDate,
                },
                images: imageObj,
                likes: 0,
                dislikes: 0,
                type: formInputs.type,
                tags: tagsObj,
                comments: 0,
                authorDisplayName: context.loggedInUser.displayName,
                authorUid: context.loggedInUser.uid,
                date: Date.now(),
                // author: this.state.loggedInUser.email,
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

    const handleFileChange = (newFile) => {
        setFileErrorText("");
        setFile(newFile);
        console.log(file);
    };

    const handleTagsChange = (newTags) => {
        setTagsErrorText("");
        setTags(newTags);
    };

    const handleChange = (e) => {
        setFormInputs((prevInputs) => {
            return {
                ...prevInputs,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let haveError = false;
        // check dates
        if (
            formInputs.endDate &&
            formInputs.startDate &&
            isBefore(
                new Date(formInputs.endDate),
                new Date(formInputs.startDate)
            )
        )
            haveError = true;

        // check image
        if (file == null || file.length === 0) {
            setFileErrorText("Choose at least 1 image please!");
            haveError = true;
        }

        // check tags
        if (tags.length < 3) {
            setTagsErrorText("Enter at least 3 features please!");
            haveError = true;
        }

        if (haveError) return;

        const postListRef = dbRef(database, DB_POSTS_KEY);
        const newPostRef = push(postListRef);
        const newPostKey = newPostRef.key;
        const tagsObj = makeArrIntoObj(tags);

        const images = await uploadFile(file, newPostKey);
        console.log("in handleSubmit");
        console.log(images);
        await writeData(images, newPostRef, tagsObj);

        clearForm();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={1} p={2} alignItems={"flex-start"}>
                <TextField
                    required
                    name="eventName"
                    label="Name of Event"
                    variant="outlined"
                    size="small"
                    value={formInputs.eventName}
                    onChange={handleChange}
                    helperText="What is the name of the event?"
                />
                <TextField
                    name="website"
                    label="Website (Optional)"
                    variant="outlined"
                    size="small"
                    value={formInputs.website}
                    onChange={handleChange}
                    helperText="Does the event have a website?"
                />
                <Stack direction={"row"} spacing={2}>
                    <TextField
                        required
                        name="startDate"
                        type="date"
                        variant="outlined"
                        size="small"
                        value={formInputs.startDate}
                        onChange={handleChange}
                        helperText={
                            formInputs.endDate &&
                            formInputs.startDate &&
                            isBefore(
                                new Date(formInputs.endDate),
                                new Date(formInputs.startDate)
                            )
                                ? "Check your dates!"
                                : "When does/did it start?"
                        }
                        error={
                            formInputs.endDate &&
                            formInputs.startDate &&
                            isBefore(
                                new Date(formInputs.endDate),
                                new Date(formInputs.startDate)
                            )
                                ? true
                                : false
                        }
                    />
                    <TextField
                        required
                        name="endDate"
                        type="date"
                        variant="outlined"
                        size="small"
                        value={formInputs.endDate}
                        onChange={handleChange}
                        helperText={
                            formInputs.endDate &&
                            formInputs.startDate &&
                            isBefore(
                                new Date(formInputs.endDate),
                                new Date(formInputs.startDate)
                            )
                                ? "Check your dates!"
                                : "When does it end?"
                        }
                        error={
                            formInputs.endDate &&
                            formInputs.startDate &&
                            isBefore(
                                new Date(formInputs.endDate),
                                new Date(formInputs.startDate)
                            )
                                ? true
                                : false
                        }
                    />
                </Stack>
                <MuiFileInput
                    size="small"
                    value={file}
                    onChange={handleFileChange}
                    placeholder="Click here to choose images"
                    multiple
                    helperText={
                        fileErrorText
                            ? fileErrorText
                            : "You can choose to upload multiple images!"
                    }
                    error={fileErrorText ? true : false}
                />
                <TextField
                    select
                    required
                    size="small"
                    name="type"
                    label="Type"
                    value={formInputs.type}
                    onChange={handleChange}
                    helperText="What type of event is this?"
                >
                    {typeOptions.map((option) => {
                        return (
                            <MenuItem value={option.value} key={option.value}>
                                {option.value}
                            </MenuItem>
                        );
                    })}
                </TextField>

                <MuiChipsInput
                    size="small"
                    value={tags}
                    onChange={handleTagsChange}
                    clearInputOnBlur
                    error={tagsErrorText ? true : false}
                    helperText={
                        tagsErrorText
                            ? tagsErrorText
                            : "What are some features of the event?"
                    }
                />
            </Stack>
            <Button type="submit" variant="contained">
                Submit
            </Button>
        </form>
    );
}

export default BazaarForm;
