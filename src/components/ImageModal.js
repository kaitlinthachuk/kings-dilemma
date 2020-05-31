import React from 'react';
import "../styles/ImageModal.scss";

function ImageModal(props) {

    let contents = null,
        showClose = props.showClose;

    if (props.isVisible) {
        let imagesTags = [];
        props.images.forEach(element => {
            imagesTags.push(<img className={element.class} src={element.path} key={element.path} alt={element.alt} onClick={element.onClick}></img>);
        });
        contents = <div className={props.class}>
            {
                showClose === "true" && < button className="close" onClick={props.closeModal} > X</button >
            }
            {imagesTags}
        </div >
    }

    return (contents);
}

export default ImageModal;