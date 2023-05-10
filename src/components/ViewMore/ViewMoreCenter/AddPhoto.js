import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import {
    ref as sRef,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { ref as dbRef, push, set, update } from "firebase/database";
import { database, storage } from "../../../firebase";
import { MuiFileInput } from "mui-file-input";
import context from "react-bootstrap/esm/AccordionContext";
import { UserContext } from "../../../App";

function AddPhoto({ selectedPost }) {
    const [openModal, setOpenModal] = useState(false);

    const [file, setFile] = useState([]);
    const [fileErrorText, setFileErrorText] = useState("");

    const userContext = useContext(UserContext);

    const uploadFile = async (files, postKey) => {
        if (files == null) return 0;

        let images = {};

        await Promise.all(
            files.map(async (image, index) => {
                const imageRef = sRef(
                    storage,
                    `images/${postKey}/${crypto.randomUUID() + image.name}`
                );
                await uploadBytesResumable(imageRef, image);
                let imageURL = await getDownloadURL(imageRef);
                images[crypto.randomUUID()] = imageURL;
            })
        );
        console.log(images);
        return images;
    };

    const handleFileChange = (newFile) => {
        setFileErrorText("");
        setFile(newFile);
        console.log(file);
    };

    const handleSubmit = async () => {
        console.log(file);
        if (file == null || file.length === 0) {
            setFileErrorText("Choose at least 1 image please!");
            return;
        }

        const imagesRef = dbRef(database, `posts/${selectedPost.key}/images`);
        const images = await uploadFile(file, selectedPost.key);
        let updates = { ...selectedPost.images, ...images };
        console.log(updates);

        await toast.promise(update(imagesRef, updates), {
            pending: `Uploading photos 🤩`,
            success: "Successfully uploaded photos! 👌",
            error: "An error occurred... 🤯",
        });

        setFile([]);
    };

    return (
        <>
            {userContext.loggedInUser && (
                <Button variant="contained" onClick={() => setOpenModal(true)}>
                    Contribute
                </Button>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle id="alert-dialog-title">
                    Add new photos
                </DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>Confirm</Button>
                    <Button onClick={() => setOpenModal(false)} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddPhoto;
