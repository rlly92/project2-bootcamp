import { Box, Stack, Typography } from "@mui/material";
import React from "react";

function SidebarWrapper({ children }) {
    return (
        <Box width={"35%"} p={3} sx={{ overflowY: "auto" }}>
            <Stack
                textAlign={"center"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                {children}
            </Stack>
        </Box>
    );
}

export default SidebarWrapper;
