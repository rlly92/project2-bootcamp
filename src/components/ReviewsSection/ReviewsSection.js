import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import ReviewsComposer from "./ReviewsComposer";
import format from "date-fns/format";
import ReviewLikesButton from "../Shared/ReviewLikesButton";
import { UserContext } from "../../App";
import Lightbox from "../Lightbox/Lightbox";
import { Add } from "@mui/icons-material";

function ReviewsSection({ selectedPost }) {
    const [mode, setMode] = useState("view");

    const userContext = useContext(UserContext);

    const handleNewReview = () => {
        setMode("submit");
    };

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
                {Object.values(selectedPost.reviews)
                    .reverse()
                    .map((review) => {
                        return (
                            <Paper
                                key={review.date + review.date + review.title}
                                sx={{ px: 3, py: 2, my: 2 }}
                            >
                                <Typography variant="h5">
                                    {review.title}
                                </Typography>
                                <Typography variant="subtitle2">
                                    @{review.authorDisplayName}
                                </Typography>
                                <Typography variant="overline">
                                    {format(new Date(review.date), "PPP")}
                                </Typography>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        bgcolor: review.recommended
                                            ? "#E7FFDD"
                                            : "#FFDDDD",
                                        width: "fit-content",
                                        px: 2,
                                        py: 1,
                                    }}
                                >
                                    <Typography variant="h6">
                                        {review.recommended === true
                                            ? "👍 Recommended!"
                                            : "👎 Not Recommended..."}
                                    </Typography>
                                </Paper>
                                {/* <Paper
                                    elevation={0}
                                    sx={{
                                        // width: "30vw",
                                        width: "33vw",
                                        height: "20vh",
                                        overflowY: "hidden",
                                        overflowX: "auto",
                                    }}
                                > */}
                                <Box
                                    sx={{
                                        width: "33vw",
                                        height: "24vh",
                                        overflowY: "hidden",
                                        overflowX: "auto",
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}
                                >
                                    <Stack direction={"row"}>
                                        <Lightbox
                                            urlArray={Object.values(
                                                review.images
                                            )}
                                        />
                                    </Stack>
                                </Box>
                                {/* </Paper> */}
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
            {mode === "view" && userContext.loggedInUser != null && (
                <Box my={1}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleNewReview}
                    >
                        Submit a review
                    </Button>
                </Box>
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
