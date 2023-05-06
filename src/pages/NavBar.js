import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";

const NavBar = ({ handleLogOut }) => {
    const navigate = useNavigate();

    const handleLogOutAndNavigate = () => {
        handleLogOut().then(() => navigate("/login"));
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton size='large' edge='start' aria-label='logo' color='inherit'>

</IconButton> */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        BIZZBAZZ
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            // sx={{ width: "50%", m: 1 }}
                            onClick={handleLogOutAndNavigate}
                            type="button"
                        >
                            Log Out
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Outlet />
        </>
    );
};

export default NavBar;
