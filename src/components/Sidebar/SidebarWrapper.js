import { Box, Stack, Typography } from "@mui/material";
import React from "react";

function SidebarWrapper({ children }) {
    return (
        <Box width={"35%"} p={3}>
            <Stack
                direction={"row"}
                textAlign={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                mb={2}
            >
                <Typography variant="h1">bizz</Typography>
                <Typography
                    variant="h1"
                    px={1}
                    py={0.5}
                    bgcolor={"black"}
                    color={"white"}
                    borderRadius={2}
                >
                    bazz
                </Typography>
            </Stack>
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
