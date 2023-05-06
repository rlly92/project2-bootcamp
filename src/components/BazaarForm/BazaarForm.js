import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
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

const DB_POSTS_KEY = "posts";
const STORAGE_IMAGES_KEY = "images";

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

    const [file, setFile] = useState(null);
    const [tags, setTags] = useState([]);

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
        console.log(newFile);
        setFile(newFile);
    };

    const handleTagsChange = (newTags) => {
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
        <form>
            <Stack spacing={1} p={2} alignItems={"flex-start"}>
                <TextField
                    required
                    name="eventName"
                    label="Name of Event"
                    variant="outlined"
                    size="small"
                    value={formInputs.eventName}
                    onChange={handleChange}
                />
                <TextField
                    name="website"
                    label="Website"
                    placeholder="Optional"
                    variant="outlined"
                    size="small"
                    value={formInputs.website}
                    onChange={handleChange}
                />
                <TextField
                    required
                    name="startDate"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={formInputs.startDate}
                    onChange={handleChange}
                />
                <TextField
                    required
                    name="endDate"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={formInputs.endDate}
                    onChange={handleChange}
                />
                <MuiFileInput
                    value={file}
                    onChange={handleFileChange}
                    multiple
                />
                <div>
                    <FormControl size="small">
                        <InputLabel id="type">Type</InputLabel>
                        <Select
                            required
                            labelId="type"
                            name="type"
                            label="type"
                            value={formInputs.type}
                            onChange={handleChange}
                        >
                            <MenuItem value="Pasar Malam">Pasar Malam</MenuItem>
                            <MenuItem value="Pop Up Store">
                                Pop Up Store
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <MuiChipsInput value={tags} onChange={handleTagsChange} />
            </Stack>
            <Button type="submit" variant="contained" onClick={handleSubmit}>
                Submit
            </Button>
        </form>
    );
}

export default BazaarForm;
