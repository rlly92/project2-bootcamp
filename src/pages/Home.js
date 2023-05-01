import React, { useEffect, useState } from "react";

import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from "@react-google-maps/api";

import { ref as dbRef, push, set } from "firebase/database";
import { database, storage, auth } from "../firebase";

import { Typography, Box, Stack, Button } from "@mui/material";

const DB_POSTS_KEY = "posts";

function Home({ posts }) {
    const [coords, setCoords] = useState({ lat: 1.3521, lng: 103.8198 });
    const [markerCoords, setMarkerCoords] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setCoords({ lat: latitude, lng: longitude });
            }
        );
    }, []);

    const writeData = () => {
        const postListRef = dbRef(database, DB_POSTS_KEY);
        const newPostRef = push(postListRef);

        set(newPostRef, {
            coords: {
                lat: markerCoords.toJSON().lat,
                lng: markerCoords.toJSON().lng,
            },
            date: Date.now(),
            // author: this.state.loggedInUser.email,
        }).then(() => console.log("successfully added to database"));
    };
    const handleClick = (e) => {
        setMarkerCoords(e.latLng);
    };

    const handleClearMarker = (e) => {
        setMarkerCoords(null);
    };

    const handleTagLocation = () => {
        writeData();
    };

    if (!isLoaded) {
        return <Typography variant="h1">Loading</Typography>;
    }

    return (
        <Box
            width={"100vw"}
            height={"100vh"}
            display={"flex"}
            flexDirection={"row"}
            textAlign={"center"}
        >
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
                    {markerCoords && (
                        <>
                            <Typography variant="h3">
                                Current position:
                            </Typography>
                            <Typography variant="body1">
                                Lat: {markerCoords.toJSON().lat.toFixed(4)},
                                Lng: {markerCoords.toJSON().lng.toFixed(4)}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ width: "50%", m: 1 }}
                                onClick={handleTagLocation}
                            >
                                Tag this location!
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ width: "50%", m: 1 }}
                                onClick={handleClearMarker}
                            >
                                Clear Marker
                            </Button>
                        </>
                    )}
                </Stack>
            </Box>
            <GoogleMap
                center={coords}
                zoom={13}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
                onClick={handleClick}
            >
                {markerCoords && <Marker position={markerCoords} />}
                {posts != null &&
                    posts.map((post) => (
                        <Marker
                            key={post.key}
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
