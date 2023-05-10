import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import { Paper } from "@mui/material";

function Lightbox({ urlArray }) {
    const [toggler, setToggler] = useState(false);
    const [productIndex, setProductIndex] = useState(0);

    const handleClick = (index) => {
        setToggler(!toggler);
        setProductIndex(index);
    };

    return (
        <>
            {urlArray.map((url, index) => {
                return (
                    <img
                        alt=""
                        src={url}
                        className="img-shadow"
                        style={{
                            height: "20vh",
                            border: "10px solid white",
                            borderRadius: "3px",
                        }}
                        loading="lazy"
                        onClick={() => handleClick(index)}
                    />
                );
            })}
            <FsLightbox
                toggler={toggler}
                sources={urlArray}
                key={productIndex}
                type="image"
            />
        </>
    );
}

export default Lightbox;
