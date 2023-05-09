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
import format from "date-fns/format";
import React, { useContext, useState } from "react";
import LikesDislikesBar from "./LikesDislikesBar";
import CommentsSection from "./CommentsSection";
import ImageCarousel from "./ImageCarousel";
import ChipsArray from "./ChipsArray";

import { currentPostContext } from "../../CurrentPostContext/CurrentPostProvider";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { UserContext } from "../../../App";
import { ref as dbRef, update } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";

import isAfter from "date-fns/isAfter";

function SideInfo({ selectedPost }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [openModal, setOpenModal] = useState(false);

    const userContext = useContext(UserContext);

    const navigate = useNavigate();

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

    const handleViewMore = () => {
        navigate(`/post/${selectedPost.key}`);
    };

    const handleMoreOptionsClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    return (
        <Paper
            sx={{
                py: 3,
                px: 1,
                width: "100%",
            }}
        >
            <Button onClick={handleViewMore}>View More</Button>
            {((userContext.loggedInUser &&
                userContext.loggedInUser.uid === selectedPost.authorUid) ||
                (userContext.loggedInUser &&
                    isAfter(
                        new Date(selectedPost.duration.endDate),
                        Date.now
                    ))) && (
                <Tooltip title="More Options">
                    <IconButton onClick={handleMoreOptionsClick}>
                        <MoreVert />
                    </IconButton>
                </Tooltip>
            )}

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {/* <MenuItem>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem> */}
                <MenuItem onClick={handleClickDeleteInMenu}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Typography variant="h4">{selectedPost.eventName}</Typography>

            <Typography variant="subtitle2">
                Posted by @{selectedPost.authorDisplayName} on{" "}
                {new Date(selectedPost.date).toLocaleString("en-SG")}
            </Typography>

            <LikesDislikesBar selectedPost={selectedPost} />

            {selectedPost.website ? (
                <Typography variant="body2">
                    Homepage: {selectedPost.website}
                </Typography>
            ) : (
                <Typography variant="body2">
                    No website was provided.
                </Typography>
            )}

            <Typography variant="h5">📍 {selectedPost.geocodeName}</Typography>

            <Typography variant="h6">
                From {format(new Date(selectedPost.duration.startDate), "PPP")}{" "}
                to {format(new Date(selectedPost.duration.endDate), "PPP")}
            </Typography>

            <ImageCarousel selectedPost={selectedPost} />

            <Typography variant="body2">Type: {selectedPost.type}</Typography>

            <Typography>Tags:</Typography>
            <ChipsArray tags={selectedPost.tags} postKey={selectedPost.key} />

            <Typography variant="h5">Comments:</Typography>
            <CommentsSection selectedPost={selectedPost} loadLocation="home" />

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle id="alert-dialog-title">
                    Confirm delete?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDelete(selectedPost.key)}>
                        Confirm
                    </Button>
                    <Button onClick={() => setOpenModal(false)} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default SideInfo;
