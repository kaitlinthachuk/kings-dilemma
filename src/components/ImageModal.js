import React, { useState } from 'react';

import "../styles/ImageModal.scss";

const images = require.context('../assets', true);

function ImageModal(props) {
    const [isOpen, setisOpen] = useState(true);
    let contents = null;

    function closeModal(e) {
        e.preventDefault();
        setisOpen(false);
    };

    if (isOpen && props.isVisible) {
        let imagesTags = [];
        props.images.forEach(element => {
            let img_src = images("./" + element.path);
            imagesTags.push(<img className="image-modal" src={img_src} alt={element.alt} obClick={element.onClick}></img>);
        });

        contents = <div className="image-modal-container">
            < button className="close" onClick={closeModal} > X</button >
            {imagesTags}
        </div >
    }

    return (
        contents
    );
}

export default ImageModal;