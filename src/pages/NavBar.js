import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Stack,
    Button,
} from "@mui/material";

const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                {/* <IconButton size='large' edge='start' aria-label='logo' color='inherit'>

</IconButton> */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    BIZZBAZZ
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button color="inherit">Log Out</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
