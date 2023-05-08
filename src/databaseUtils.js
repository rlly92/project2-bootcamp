import {
    ref as sRef,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { ref as dbRef, push, set } from "firebase/database";
import { database, storage } from "./firebase";
import { toast } from "react-toastify";

const STORAGE_IMAGES_KEY = "images";

export const uploadFile = async (files, postKey) => {
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
                `Successfully uploaded image! (${index + 1}/${files.length})`,
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

export const makeArrIntoObj = (arr, uid) => {
    const newObj = {};
    arr.forEach((item) => {
        newObj[crypto.randomUUID()] = {
            authorUid: uid,
            text: item,
        };
    });
    return newObj;
};
