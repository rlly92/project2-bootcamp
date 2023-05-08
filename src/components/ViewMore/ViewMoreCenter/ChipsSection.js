import React, { useState } from "react";
import ChipsArray from "../../Sidebar/SideInfo/ChipsArray";
import { Box, Button } from "@mui/material";
import ChipsComposer from "./ChipsComposer";

function ChipsSection(props) {
    const [mode, setMode] = useState("view");

    return (
        <Box>
            <ChipsArray {...props} />
            {mode === "view" && (
                <Button variant="contained" onClick={() => setMode("edit")}>
                    Contribute
                </Button>
            )}
            {mode === "edit" && <ChipsComposer {...props} setMode={setMode} />}
        </Box>
    );
}

export default ChipsSection;
