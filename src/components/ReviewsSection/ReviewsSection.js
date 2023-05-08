import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import ReviewsComposer from "./ReviewsComposer";
import format from "date-fns/format";
import ReviewLikesButton from "../Shared/ReviewLikesButton";

function ReviewsSection({ selectedPost }) {
    const [mode, setMode] = useState("view");

    const handleNewReview = () => {
        setMode("submit");
    };

    if (selectedPost) {
        console.log(selectedPost.reviews);
    }

    let reviewsRender;
    if (selectedPost && selectedPost.reviews == null)
        reviewsRender = (
            <>
                <Typography variant="body1">No reviews yet.</Typography>
            </>
        );
    else
        reviewsRender = (
            <>
                {Object.values(selectedPost.reviews).map((review) => {
                    return (
                        <Paper
                            key={review.date + review.date + review.title}
                            sx={{ px: 3, py: 2 }}
                        >
                            <Typography variant="h5">{review.title}</Typography>
                            <Typography variant="subtitle2">
                                @{review.authorDisplayName}
                            </Typography>
                            <Typography variant="overline">
                                {format(new Date(review.date), "PPP")}
                            </Typography>
                            <Typography variant="h6">
                                {review.recommended === true
                                    ? "👍 Recommended!"
                                    : "👎 Not Recommended..."}
                            </Typography>
                            <Paper
                                sx={{
                                    width: "30vw",
                                    height: "20vh",
                                    overflowY: "hidden",
                                    overflowX: "auto",
                                }}
                            >
                                <Stack direction={"row"} spacing={2}>
                                    {Object.values(review.images).map((url) => {
                                        return (
                                            <a href={url} key={url}>
                                                <img
                                                    alt=""
                                                    src={url}
                                                    style={{
                                                        height: "17vh",
                                                        width: "auto",
                                                    }}
                                                />
                                            </a>
                                        );
                                    })}
                                </Stack>
                            </Paper>
                            <br />
                            <Typography variant="body1">
                                {review.text}
                            </Typography>
                            <br />
                            <ReviewLikesButton
                                postKey={selectedPost.key}
                                review={review}
                            />
                        </Paper>
                    );
                })}
                <Typography variant="overline">End of reviews list.</Typography>
            </>
        );

    return (
        <Box>
            {mode === "view" && (
                <Button variant="contained" onClick={handleNewReview}>
                    Submit a review
                </Button>
            )}

            {mode === "view" && reviewsRender}
            {mode === "submit" && (
                <ReviewsComposer
                    selectedPost={selectedPost}
                    setMode={setMode}
                />
            )}
        </Box>
    );
}

export default ReviewsSection;
