import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function ChipsArray({ tags }) {
    let keysArray = Object.keys(tags);

    return (
        <Paper
            sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            {keysArray.map((key) => {
                return (
                    <ListItem key={key}>
                        <Chip
                            uid={tags[key].authorUid}
                            label={tags[key].text}
                        />
                    </ListItem>
                );
            })}
        </Paper>
    );
}
