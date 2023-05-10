import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import ReviewsSection from "../ReviewsSection/ReviewsSection";

function ViewMoreRight({ selectedPost }) {
    return (
        <Box flex={3}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4">
                    Reviews by the community 🧐
                </Typography>
                <ReviewsSection selectedPost={selectedPost} />
            </Paper>
        </Box>
    );
}

export default ViewMoreRight;
