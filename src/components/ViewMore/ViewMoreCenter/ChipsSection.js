import React, { useContext, useState } from "react";
import ChipsArray from "../../Sidebar/SideInfo/ChipsArray";
import { Box, Button, Stack } from "@mui/material";
import ChipsComposer from "./ChipsComposer";
import { UserContext } from "../../../App";
import { Add } from "@mui/icons-material";

function ChipsSection(props) {
    const [mode, setMode] = useState("view");

    const userContext = useContext(UserContext);

    return (
        <Box>
            <ChipsArray {...props} />
            {mode === "view" && userContext.loggedInUser && (
                <Stack direction={"row"} justifyContent={"flex-end"}>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        onClick={() => setMode("edit")}
                    >
                        Contribute
                    </Button>
                </Stack>
            )}
            {mode === "edit" && <ChipsComposer {...props} setMode={setMode} />}
        </Box>
    );
}

export default ChipsSection;
