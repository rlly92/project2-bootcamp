import React, { useContext, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import { ref as dbRef, update } from "firebase/database";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

import { database } from "../../../firebase";
import { toast } from "react-toastify";
import { UserContext } from "../../App";

function EditDeleteOption() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [openModal, setOpenModal] = useState(false);

    const userContext = useContext(UserContext);

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleClickDeleteInMenu = () => {
        setOpenModal(true);
        setAnchorEl(null);
    };

    const handleDelete = (postKey) => {
        const postListRef = dbRef(database, `posts`);

        toast.promise(
            update(postListRef, {
                [postKey]: null,
            }),
            {
                pending: "Uploading in progress...",
                success: "Post deleted!",
                error: "Error! 🤔",
            }
        );
        console.log("deletion");
    };

    const handleMoreOptionsClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClickDeleteInMenu}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
            ></Dialog>
        </>
    );
}

export default EditDeleteOption;
