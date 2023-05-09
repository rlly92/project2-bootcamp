import React, { useContext, useState } from "react";
import ChipsArray from "../../Sidebar/SideInfo/ChipsArray";
import { Box, Button } from "@mui/material";
import ChipsComposer from "./ChipsComposer";
import { UserContext } from "../../../App";

function ChipsSection(props) {
    const [mode, setMode] = useState("view");

    const userContext = useContext(UserContext);

    return (
        <Box>
            <ChipsArray {...props} />
            {mode === "view" && userContext.loggedInUser && (
                <Button variant="contained" onClick={() => setMode("edit")}>
                    Contribute
                </Button>
            )}
            {mode === "edit" && <ChipsComposer {...props} setMode={setMode} />}
        </Box>
    );
}

export default ChipsSection;
