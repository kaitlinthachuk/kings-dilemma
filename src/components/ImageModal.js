import React from 'react';

import "../styles/ImageModal.scss";

const images = require.context('../assets', true);

function ImageModal(props) {

    let contents = null,
        showClose = props.showClose;

    if (props.isVisible) {
        let imagesTags = [];
        props.images.forEach(element => {
            let img_src = images("./" + element.path);
            imagesTags.push(<img className={element.class} src={img_src} key={img_src} alt={element.alt} onClick={element.onClick}></img>);
        });
        contents = <div className={props.class}>
            {
                showClose == "true" && < button className="close" onClick={props.closeModal} > X</button >
            }
            {imagesTags}
        </div >
    }

    return (contents);
}

export default ImageModal;