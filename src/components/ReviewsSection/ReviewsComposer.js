import {
    Box,
    Button,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useContext, useState } from "react";
import { UserContext } from "../../App";
import {
    ref as sRef,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { ref as dbRef, push, set, update } from "firebase/database";
import { database, storage } from "../../firebase";
import { toast } from "react-toastify";

const DB_POSTS_KEY = "posts";
const STORAGE_IMAGES_KEY = "images";

function ReviewsComposer({ selectedPost, setMode }) {
    const [formInputs, setFormInputs] = useState({
        title: "",
        text: "",
        authorDisplayName: "",
        recommended: true,
    });

    const [file, setFile] = useState([]);
    const [fileErrorText, setFileErrorText] = useState("");

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
        return images;
    };

    const writeData = async (imageObj, newRef, key) => {
        try {
            await set(newRef, {
                title: formInputs.title,
                text: formInputs.text,
                recommended: formInputs.recommended,
                authorDisplayName: context.loggedInUser.displayName,
                authorUid: context.loggedInUser.uid,
                date: Date.now(),
                images: imageObj,
                likes: 0,
                key,
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

    const updateExistingData = async (postKey, images) => {
        const imagesRef = dbRef(database, `${DB_POSTS_KEY}/${postKey}/images`);

        let updates = { ...selectedPost.images, ...images };

        update(imagesRef, updates);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let haveError = false;

        // check image
        if (file == null || file.length === 0) {
            setFileErrorText("Choose at least 1 image please!");
            haveError = true;
        }

        if (haveError) return;

        const reviewListRef = dbRef(
            database,
            `${DB_POSTS_KEY}/${selectedPost.key}/reviews`
        );
        const newReviewRef = push(reviewListRef);
        const newReviewKey = newReviewRef.key;

        const images = await uploadFile(file, selectedPost.key);
        await updateExistingData(selectedPost.key, images);
        await writeData(images, newReviewRef, newReviewKey);

        setFormInputs({
            title: "",
            text: "",
            authorDisplayName: "",
            recommended: true,
        });
        closeForm();
    };

    const closeForm = () => {
        setMode("view");
    };

    const handleCloseForm = () => {
        closeForm();
    };

    const handleFileChange = (newFile) => {
        setFileErrorText("");
        setFile(newFile);
    };

    const handleChange = (e) => {
        setFormInputs((prevInputs) => {
            return {
                ...prevInputs,
                [e.target.name]: e.target.value,
            };
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={1} p={2} alignItems={"flex-start"}>
                <TextField
                    required
                    fullWidth
                    name="title"
                    label="Title"
                    variant="outlined"
                    size="small"
                    value={formInputs.title}
                    onChange={handleChange}
                    helperText="Keep it short and sweet!"
                />
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
                    multiline
                    fullWidth
                    required
                    rows={4}
                    name="text"
                    placeholder="How was your experience?"
                    variant="outlined"
                    size="small"
                    value={formInputs.text}
                    onChange={handleChange}
                    helperText="Does the event have a website?"
                />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                name="recommended"
                                checked={
                                    formInputs.recommended === true
                                        ? true
                                        : false
                                }
                                onChange={() =>
                                    setFormInputs((prevInputs) => {
                                        return {
                                            ...prevInputs,
                                            recommended:
                                                !prevInputs.recommended,
                                        };
                                    })
                                }
                            />
                        }
                        label={
                            formInputs.recommended === true
                                ? "I recommend this!"
                                : "I don't recommend this..."
                        }
                    />
                </FormGroup>
                <Button type="submit" variant="contained">
                    Submit
                </Button>
                <Button
                    type="button"
                    variant="contained"
                    onClick={handleCloseForm}
                >
                    Back
                </Button>
            </Stack>
        </form>
    );
}

export default ReviewsComposer;
