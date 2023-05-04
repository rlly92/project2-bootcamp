export const libraries = ["places"];

// const writeData = async () => {
//     const postListRef = dbRef(database, DB_POSTS_KEY);
//     const newPostRef = push(postListRef);

//     let geocodeName = await getAddressFromLatLng(
//         markerCoords.toJSON().lat,
//         markerCoords.toJSON().lng
//     );

//     await set(newPostRef, {
//         eventName: "MEGA BAZAAR",
//         geocodeName: geocodeName,
//         website: "https://www.timeout.sg",
//         coords: {
//             lat: markerCoords.toJSON().lat,
//             lng: markerCoords.toJSON().lng,
//         },
//         duration: {
//             startDate: Date.now() - 100000,
//             endDate: Date.now(),
//         },
//         images: 0,
//         likes: 0,
//         dislikes: 0,
//         type: 0,
//         tags: 0,
//         comments: 0,
//         author: "Bob",
//         date: Date.now(),
//         // author: this.state.loggedInUser.email,
//     });

//     toast.success("Successfully added to database!", {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//     });
// };
