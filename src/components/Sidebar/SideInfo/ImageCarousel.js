import { Button } from "@mui/material";
import Image from "mui-image";
import Carousel from "react-bootstrap/Carousel";

function ImageCarousel({ selectedPost }) {
    let urlArray = Object.values(selectedPost.images);
    console.log(urlArray);
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
                    <Button sx={{ height: "30vh" }}>
                        View {urlArray.length - 5} more images
                    </Button>
                </Carousel.Item>
            )}
        </Carousel>
    );
}

export default ImageCarousel;
