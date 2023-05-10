import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useContext,
} from "react";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

import { useNavigate } from "react-router-dom";

import { Typography, Box, Button, TextField, Paper } from "@mui/material";

import Geocode from "react-geocode";
import BazaarForm from "../components/BazaarForm/BazaarForm";
import SideInfo from "../components/Sidebar/SideInfo/SideInfo";
import SidebarWrapper from "../components/Sidebar/SidebarWrapper";

import { libraries } from "../googleUtils";

import greenMarker from "../assets/images/permMarkerResized.png";
import { UserContext } from "../App";
import { currentPostContext } from "../components/CurrentPostContext/CurrentPostProvider";

const options = {
    // zoomControl: false,
    // streetViewControl: false,
    // mapTypeControl: false,
    // fullscreenControl: false,
    disableDefaultUI: true,
    clickableIcons: false,
};

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);

function Home({ handleLogOut }) {
    const [coords, setCoords] = useState({ lat: 1.3521, lng: 103.8198 });
    const [markerCoords, setMarkerCoords] = useState(null);
    const [nameAtMarkerCoords, setNameAtMarkerCoords] = useState("");
    const [showBazaarForm, setShowBazaarForm] = useState(false);

    // Context and display name variables:
    const context = useContext(UserContext);
    const displayName = context.loggedInUser.displayName;

    const postContext = useContext(currentPostContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("Home is mounted");
    }, []);

    // useEffect function to check for displayName, if don't have, redirect to CreateProfile.js
    useEffect(() => {
        if (displayName == null) {
            navigate("/createprofile");
        }
    }, [displayName]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries: libraries,
    });

    // const coords = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);
    const mapRef = useRef();

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setCoords({ lat: latitude, lng: longitude });
            }
        );
    }, []);

    const getAddressFromLatLng = async (lat, lng) => {
        try {
            let response = await Geocode.fromLatLng(lat, lng);
            return response.results[0].formatted_address;
        } catch (err) {
            console.log(err);
        }
    };

    const handleClick = (e) => {
        setNameAtMarkerCoords("");
        postContext.setSelectedPost(null);
        setShowBazaarForm(false);
        setMarkerCoords(e.latLng);
    };

    const handleClearMarker = (e) => {
        setMarkerCoords(null);
        clearForm();
    };

    const handleTagLocation = async () => {
        setShowBazaarForm(true);
        let geocodeName = await getAddressFromLatLng(
            markerCoords.toJSON().lat,
            markerCoords.toJSON().lng
        );

        setNameAtMarkerCoords(geocodeName);
    };

    const handleMarkerClick = async (post) => {
        setMarkerCoords(null);
        postContext.setSelectedPost(post);
        setShowBazaarForm(false);
    };

    const clearForm = () => {
        setShowBazaarForm(false);
    };

    if (!isLoaded) {
        return <Typography variant="h1">Loading...</Typography>;
    }

    // if (isLoaded) console.log("Google maps loaded");

    return (
        <Box
            width={"100vw"}
            height={"100%"}
            display={"flex"}
            flexDirection={"row"}
        >
            <SidebarWrapper>
                <Typography variant="h4">
                    Welcome back, @{displayName}
                </Typography>
                <Typography variant="body1" mt={1} mb={2}>
                    Click anywhere on the map to get started.
                </Typography>
                {/* <TextField variant="outlined" size="small" /> */}
                {markerCoords && (
                    <>
                        <Typography variant="h3">Current position:</Typography>
                        {nameAtMarkerCoords === "" ? (
                            <Paper sx={{ p: 2, my: 1 }} elevation={4}>
                                <Typography variant="body1">
                                    Lat: {markerCoords.toJSON().lat.toFixed(4)},
                                    Lng: {markerCoords.toJSON().lng.toFixed(4)}
                                </Typography>
                            </Paper>
                        ) : (
                            <Typography variant="body1">
                                {nameAtMarkerCoords}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            sx={{ width: "50%", my: 2 }}
                            onClick={handleTagLocation}
                        >
                            Tag this location!
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: "50%" }}
                            onClick={handleClearMarker}
                        >
                            Clear Marker
                        </Button>
                    </>
                )}
                {postContext.selectedPost && (
                    <SideInfo selectedPost={postContext.selectedPost} />
                )}
                {showBazaarForm && (
                    <BazaarForm
                        geocodeName={nameAtMarkerCoords}
                        markerCoords={markerCoords}
                        clearForm={clearForm}
                    />
                )}
            </SidebarWrapper>

            <GoogleMap
                center={coords}
                zoom={13}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={options}
                onClick={handleClick}
                onLoad={onLoad}
            >
                {markerCoords && <Marker position={markerCoords} />}
                {postContext.posts != null &&
                    postContext.posts.map((post) => (
                        <Marker
                            icon={greenMarker}
                            key={post.key}
                            onClick={() => handleMarkerClick(post)}
                            position={{
                                lat: post.coords.lat,
                                lng: post.coords.lng,
                            }}
                        />
                    ))}
            </GoogleMap>
        </Box>
    );
}

export default Home;
