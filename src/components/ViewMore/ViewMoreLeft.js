import { Box, Link, Skeleton, Typography } from "@mui/material";
import React from "react";
import LikesDislikesBar from "../Sidebar/SideInfo/LikesDislikesBar";
import format from "date-fns/format";
import { Stack } from "react-bootstrap";
import { OpenInNew } from "@mui/icons-material";
import Image from "mui-image";

function ViewMoreLeft({ selectedPost }) {
    return (
        <Box flex={2}>
            <Stack direction={"row"}>
                <Typography variant="h3">{selectedPost.eventName}</Typography>
            </Stack>
            <Typography variant="subtitle2">
                Posted by @{selectedPost.authorDisplayName} on{" "}
                {new Date(selectedPost.date).toLocaleString("en-SG")}
            </Typography>
            <Box>
                <LikesDislikesBar selectedPost={selectedPost} />
                <Typography variant="caption">
                    ( based on {Object.keys(selectedPost.likes).length} ratings
                    )
                </Typography>
            </Box>
            <br />
            <Typography variant="body1">{selectedPost.type}</Typography>

            {selectedPost.website ? (
                <Typography variant="body1">
                    Homepage:{" "}
                    <Link
                        href={`https://${selectedPost.website}`} // need to check for https
                        target="_blank"
                        rel="noopener"
                    >
                        {selectedPost.website} <OpenInNew fontSize="11px" />
                    </Link>
                </Typography>
            ) : (
                <Typography variant="body1">
                    No website was provided.
                </Typography>
            )}

            <br />
            <Typography variant="h4">
                Happening from <br />
                {format(
                    new Date(selectedPost.duration.startDate),
                    "PPP"
                )} to <br />
                {format(new Date(selectedPost.duration.endDate), "PPP")}
            </Typography>
            <br />
            <Typography variant="h5">📍 {selectedPost.geocodeName}</Typography>
            <Image
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${selectedPost.coords.lat},${selectedPost.coords.lng}&zoom=15&size=350x350&markers=${selectedPost.coords.lat},${selectedPost.coords.lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`}
                showLoading
                width={"350px"}
                height={"350px"}
                duration={1000}
            />
        </Box>
    );
}

export default ViewMoreLeft;
