import { Box, Stack } from "@mui/material";
import React from "react";

function SidebarWrapper({ children }) {
    return (
        <Box
            width={"35%"}
            px={3}
            pt={3}
            pb={10}
            sx={{ overflowY: "auto" }}
            height={"100%"}
        >
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
