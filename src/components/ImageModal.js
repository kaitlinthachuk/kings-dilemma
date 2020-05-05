import React, { useEffect, useState } from 'react';

const images = require.context('../assets/images', true);

function ImageModal(props) {
    const [isVisible, setIsVisible] = useState(props.visible);

    let img_str = "./" + props.path;
    let img_src = images(img_str);

    function closeModal(e) {
        e.preventDefault();
        setIsVisible(false);
    }

    let contents;

    if (isVisible) {
        contents = <div className="image-modal">< button className="close" onClick={closeModal} > X</button >
            <img src={img_src} alt={props.altText}></img></div>
    } else {
        contents = <></>
    }

    return (
        <div className="image-modal-container">
            {conents}
        </div >

    );
}

export default ImageModal;

// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}