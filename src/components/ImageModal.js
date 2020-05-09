import React from 'react';

import "../styles/ImageModal.scss";

const images = require.context('../assets/images', true);

function ImageModal(props) {
    let contents = null;

    if (props.isVisible) {
        let img_str = "./" + props.path;
        let img_src = images(img_str);
        contents = <div className="image-modal-container">
            < button className="close" onClick={props.closeModal} > X</button >
            <img className="image-modal" src={img_src} alt={props.altText}></img>
        </div >
    }

    return (
        contents
    );
}

export default ImageModal;