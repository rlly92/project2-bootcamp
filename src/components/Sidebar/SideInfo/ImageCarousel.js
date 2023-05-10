import { Box, Button, Typography } from "@mui/material";
import Image from "mui-image";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";

function ImageCarousel({ selectedPost }) {
    const navigate = useNavigate();

    if (selectedPost.images == null)
        return <Typography variant="body1">No images yet. 🥱</Typography>;
    let urlArray = Object.values(selectedPost.images);
    let carouselRender;
    if (urlArray.length > 5)
        carouselRender = urlArray.slice(0, 5).map((url) => {
            return (
                <Carousel.Item key={url}>
                    <Image src={url} height="30vh" showLoading duration={0} />
                </Carousel.Item>
            );
        });
    else
        carouselRender = urlArray.map((url) => {
            return (
                <Carousel.Item key={url}>
                    <Image src={url} height="30vh" showLoading duration={0} />
                </Carousel.Item>
            );
        });
    return (
        <Carousel fade>
            {carouselRender}
            {urlArray.length > 5 && (
                <Carousel.Item>
                    <Box
                        height={"30vh"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Button
                            onClick={() =>
                                navigate(`/post/${selectedPost.key}`)
                            }
                        >
                            View {urlArray.length - 5} more{" "}
                            {urlArray.length - 5 === 1 ? "image" : "images"}
                        </Button>
                    </Box>
                </Carousel.Item>
            )}
        </Carousel>
    );
}

export default ImageCarousel;
