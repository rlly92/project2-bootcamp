import React, { useEffect, useState } from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { useNavigate } from "react-router-dom";

import { ref as dbRef, push, set } from "firebase/database";

import { database, storage, auth } from "../firebase";

import { toast } from "react-toastify";

import {
  Typography,
  Box,
  Stack,
  Button,
  Input,
  TextField,
} from "@mui/material";

import Geocode from "react-geocode";
import SidebarWrapper from "../components/Sidebar/SidebarWrapper";
import SideInfo from "../components/Sidebar/SideInfo/SideInfo";
import { libraries } from "../googleUtils";

const DB_POSTS_KEY = "posts";

const options = {
  // zoomControl: false,
  // streetViewControl: false,
  // mapTypeControl: false,
  // fullscreenControl: false,
  disableDefaultUI: true,
  clickableIcons: false,
};

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);

function Home({ posts, handleLogOut }) {
  const [coords, setCoords] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markerCoords, setMarkerCoords] = useState(null);
  const [nameAtMarkerCoords, setNameAtMarkerCoords] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: libraries,
  });

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

  const writeData = async () => {
    const postListRef = dbRef(database, DB_POSTS_KEY);
    const newPostRef = push(postListRef);

    let geocodeName = await getAddressFromLatLng(
      markerCoords.toJSON().lat,
      markerCoords.toJSON().lng
    );

    await set(newPostRef, {
      eventName: "MEGA BAZAAR",
      geocodeName: geocodeName,
      website: "https://www.timeout.sg",
      coords: {
        lat: markerCoords.toJSON().lat,
        lng: markerCoords.toJSON().lng,
      },
      duration: {
        startDate: Date.now() - 100000,
        endDate: Date.now(),
      },
      images: 0,
      likes: 0,
      dislikes: 0,
      type: 0,
      tags: 0,
      comments: 0,
      author: "Bob",
      date: Date.now(),
      // author: this.state.loggedInUser.email,
    });

    toast.success("Successfully added to database!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleClick = (e) => {
    setNameAtMarkerCoords("");
    setSelectedPost(null);

    setMarkerCoords(e.latLng);
  };

  const handleClearMarker = (e) => {
    setMarkerCoords(null);
  };

  const handleTagLocation = () => {
    writeData();
  };

  const handleMarkerClick = async (post) => {
    setMarkerCoords(null);
    setSelectedPost(post);
  };

  const handleLogOutAndNavigate = () => {
    handleLogOut().then(() => {
      navigate("/");
    });
  };

  if (!isLoaded) {
    return <Typography variant="h1">Loading...</Typography>;
  }

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"row"}
      textAlign={"center"}
    >
      <SidebarWrapper>
        <Typography variant="body1">
          Type in a place or click on the map to get started
        </Typography>
        <TextField variant="outlined" size="small" />

        <br />

        <button onClick={handleLogOutAndNavigate}>Logout</button>

        {markerCoords && (
          <>
            <Typography variant="h3">Current position:</Typography>
            {nameAtMarkerCoords === "" ? (
              <Typography variant="body1">
                Lat: {markerCoords.toJSON().lat.toFixed(4)}, Lng:{" "}
                {markerCoords.toJSON().lng.toFixed(4)}
              </Typography>
            ) : (
              <Typography variant="body1">{nameAtMarkerCoords}</Typography>
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
      </SidebarWrapper>

      <GoogleMap
        center={coords}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={options}
        onClick={handleClick}
      >
        {markerCoords && <Marker position={markerCoords} />}
        {posts != null &&
          posts.map((post) => (
            <Marker
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
