import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import React, { useState } from "react";

import { ref as dbRef, push, set } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "react-toastify";

const DB_POSTS_KEY = "posts";

/* <TextField id="outlined-basic" label="name" variant="outlined" size="small" />; */

function BazaarForm({ geocodeName, markerCoords, author, clearForm }) {
    const [formInputs, setFormInputs] = useState({
        eventName: "",
        website: "",
        startDate: "",
        endDate: "",
        fileInputFile: null,
        fileInputValue: "",
        type: "",
        tags: "",
    });

    const writeData = async () => {
        const postListRef = dbRef(database, DB_POSTS_KEY);
        const newPostRef = push(postListRef);

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
                images: 0,
                likes: 0,
                dislikes: 0,
                type: formInputs.type,
                tags: formInputs.tags,
                comments: 0,
                author: author,
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

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setFormInputs((prevInputs) => {
            return {
                ...prevInputs,
                fileInputFile: e.target.files[0],
                fileInputValue: e.target.value,
            };
        });
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
        try {
            await writeData();

            clearForm();
        } catch (err) {
            console.log(err);
        }
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
                <TextField
                    name="images"
                    type="file"
                    variant="outlined"
                    size="small"
                    value={formInputs.fileInputValue}
                    onChange={handleFileChange}
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
                            <MenuItem value="pasar-malam">Pasar Malam</MenuItem>
                            <MenuItem value="pop-up-store">
                                Pop Up Store
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <TextField
                    label="tags"
                    name="tags"
                    variant="outlined"
                    size="small"
                    value={formInputs.tags}
                    onChange={handleChange}
                />
            </Stack>
            <Button type="submit" variant="contained" onClick={handleSubmit}>
                Submit
            </Button>
        </form>
    );
}

export default BazaarForm;
