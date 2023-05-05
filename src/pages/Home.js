import React, { useCallback, useEffect, useRef, useState } from "react";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

import { useNavigate } from "react-router-dom";

import { ref as dbRef, onChildAdded, onChildChanged } from "firebase/database";

import { database } from "../firebase";

import { Typography, Box, Button, TextField } from "@mui/material";

import Geocode from "react-geocode";
import BazaarForm from "../components/BazaarForm/BazaarForm";
import SideInfo from "../components/Sidebar/SideInfo/SideInfo";
import SidebarWrapper from "../components/Sidebar/SidebarWrapper";

import { libraries } from "../googleUtils";

import greenMarker from "../assets/images/permMarkerResized.png";
import { UserContext } from "../App";

const options = {
    // zoomControl: false,
    // streetViewControl: false,
    // mapTypeControl: false,
    // fullscreenControl: false,
    disableDefaultUI: true,
    clickableIcons: false,
};

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);
const DB_POSTS_KEY = "posts";

function Home({ handleLogOut }) {
    const [coords, setCoords] = useState({ lat: 1.3521, lng: 103.8198 });
    const [markerCoords, setMarkerCoords] = useState(null);
    const [nameAtMarkerCoords, setNameAtMarkerCoords] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    const [showBazaarForm, setShowBazaarForm] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const postsRef = dbRef(database, DB_POSTS_KEY);

        onChildAdded(postsRef, (data) => {
            setPosts((prevPosts) => [
                ...prevPosts,
                {
                    key: data.key,
                    eventName: data.val().eventName,
                    geocodeName: data.val().geocodeName,
                    website: data.val().website,
                    coords: {
                        lat: data.val().coords.lat,
                        lng: data.val().coords.lng,
                    },
                    duration: {
                        startDate: data.val().duration.startDate,
                        endDate: data.val().duration.endDate,
                    },
                    images: data.val().images,
                    likes: data.val().likes,
                    dislikes: data.val().dislikes,
                    type: data.val().type,
                    tags: data.val().tags,
                    comments: data.val().comments,
                    author: data.val().author,
                    date: data.val().date,
                },
            ]);
        });

        onChildChanged(postsRef, (data) => {
            setPosts((prevPosts) => {
                let changedPost = prevPosts.find(
                    (post) => post.key === data.key
                );
                let index = prevPosts.indexOf(changedPost);
                console.log(index);
                let copy = [...prevPosts];
                copy.splice(index, 1, {
                    key: data.key,
                    eventName: data.val().eventName,
                    geocodeName: data.val().geocodeName,
                    website: data.val().website,
                    coords: {
                        lat: data.val().coords.lat,
                        lng: data.val().coords.lng,
                    },
                    duration: {
                        startDate: data.val().duration.startDate,
                        endDate: data.val().duration.endDate,
                    },
                    images: data.val().images,
                    likes: data.val().likes,
                    dislikes: data.val().dislikes,
                    type: data.val().type,
                    tags: data.val().tags,
                    comments: data.val().comments,
                    author: data.val().author,
                    date: data.val().date,
                });
                return [...copy];
            });
            setPosts((prevPosts) => [...prevPosts]);
            console.log("child changed");
        });
    }, []);

    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    //     libraries: libraries,
    // });

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
        setSelectedPost(null);
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
        setSelectedPost(post);
        setShowBazaarForm(false);
    };

    const clearForm = () => {
        setShowBazaarForm(false);
    };

    const handleLogOutAndNavigate = () => {
        handleLogOut().then(() => navigate("/"));
    };

    // if (!isLoaded) {
    //     return <Typography variant="h1">Loading...</Typography>;
    // }

    return (
        <Box
            width={"100vw"}
            height={"100vh"}
            display={"flex"}
            flexDirection={"row"}
            textAlign={"center"}
        >
            <SidebarWrapper>
                <Button
                    variant="contained"
                    sx={{ width: "50%", m: 1 }}
                    onClick={handleLogOutAndNavigate}
                    type="button"
                >
                    Log Out
                </Button>
                <Typography variant="body1">
                    Type in a place or click on the map to get started
                </Typography>
                <TextField variant="outlined" size="small" />

                {markerCoords && (
                    <>
                        <Typography variant="h3">Current position:</Typography>
                        {nameAtMarkerCoords === "" ? (
                            <Typography variant="body1">
                                Lat: {markerCoords.toJSON().lat.toFixed(4)},
                                Lng: {markerCoords.toJSON().lng.toFixed(4)}
                            </Typography>
                        ) : (
                            <Typography variant="body1">
                                {nameAtMarkerCoords}
                            </Typography>
                        )}

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

                {selectedPost && <SideInfo selectedPost={selectedPost} />}
                {showBazaarForm && (
                    <BazaarForm
                        geocodeName={nameAtMarkerCoords}
                        markerCoords={markerCoords}
                        author="Timmy"
                        clearForm={clearForm}
                    />
                )}
            </SidebarWrapper>

            {/* <GoogleMap
                center={coords}
                zoom={13}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={options}
                onClick={handleClick}
                onLoad={onLoad}
            >
                {markerCoords && <Marker position={markerCoords} />}
                {posts != null &&
                    posts.map((post) => (
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
            </GoogleMap> */}
        </Box>
    );
}

export default Home;
