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
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import format from "date-fns/format";
import React, { useContext, useEffect, useState } from "react";
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
import isBefore from "date-fns/isBefore";

const typeOptions = [{ value: "Pasar Malam" }, { value: "Pop Up Store" }];

function SideInfo({ selectedPost }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [formInputs, setFormInputs] = useState({
        eventName: selectedPost.eventName,
        website: selectedPost.website == null ? "" : selectedPost.website,
        startDate: selectedPost.duration.startDate,
        endDate: selectedPost.duration.endDate,
        type: selectedPost.type,
    });

    useEffect(() => {
        setFormInputs({
            eventName: selectedPost.eventName,
            website: selectedPost.website == null ? "" : selectedPost.website,
            startDate: selectedPost.duration.startDate,
            endDate: selectedPost.duration.endDate,
            type: selectedPost.type,
        });
    }, [selectedPost]);

    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleClickInMenu = (button) => {
        if (button === "delete") {
            setOpenDeleteModal(true);
            setAnchorEl(null);
            return;
        }

        setOpenEditModal(true);
        setAnchorEl(null);
        return;
    };

    const handleChange = (e) => {
        setFormInputs((prevInputs) => {
            return {
                ...prevInputs,
                [e.target.name]: e.target.value,
            };
        });
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

        setOpenDeleteModal(false);
    };

    const handleEdit = (postKey) => {
        const postRef = dbRef(database, `posts/${postKey}`);

        toast.promise(
            update(postRef, {
                eventName: formInputs.eventName,
                website: formInputs.website ? formInputs.website : "",
                duration: {
                    startDate: formInputs.startDate,
                    endDate: formInputs.endDate,
                },
                type: formInputs.type,
            }),
            {
                pending: "Uploading in progress...",
                success: "Successfully edited post!",
                error: "Error! 🤔",
            }
        );

        setOpenEditModal(false);
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
                {userContext.loggedInUser &&
                    userContext.loggedInUser.uid === selectedPost.authorUid && (
                        <MenuItem onClick={() => handleClickInMenu("edit")}>
                            <ListItemIcon>
                                <Edit fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                        </MenuItem>
                    )}

                <MenuItem onClick={() => handleClickInMenu("delete")}>
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

            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
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
                    <Button onClick={() => setOpenDeleteModal(false)} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <DialogTitle id="alert-dialog-title">Edit a post</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
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
                                        <MenuItem
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.value}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEdit(selectedPost.key)}>
                        Confirm
                    </Button>
                    <Button onClick={() => setOpenEditModal(false)} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default SideInfo;
