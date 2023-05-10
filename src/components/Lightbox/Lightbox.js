import React, { useState } from "react";
import FsLightbox from "fslightbox-react";

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
                        key={url}
                        src={url}
                        style={{
                            height: "20vh",
                            border: "3px solid red",
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
