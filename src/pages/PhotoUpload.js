import React, { useState } from 'react';
import { storage } from '../firebase.js';

import "../styles/PhotoUpload.scss";

function PhotoUpload(props) {
    const [imageEndpoint, setImageEndpoint] = useState("");
    const [imageToUpload, setImageToUpload] = useState("");

    function handleChange(e) {
        e.preventDefault();
        setImageEndpoint(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        let storageRef = storage.ref(),
            imageRef = storageRef.child('images/' + imageEndpoint);

        imageRef.put(imageToUpload).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });
    }

    function imageSelected(e) {
        e.preventDefault();
        setImageToUpload(e.target.files[0]);
    }

    return (
        <div className="upload-container">
            <form onSubmit={handleSubmit}>
                <div className="endpoint-container">
                    <label htmlFor="sticker-endpoint">Chronicle Sticker</label>
                    <input
                        type="radio"
                        name="image-endpoint"
                        id="sticker-endpoint"
                        className="endpoint"
                        value="sticker.png"
                        onChange={handleChange}
                    />
                    <label htmlFor="voting-endpoint">Voting Card</label>
                    <input
                        type="radio"
                        name="image-endpoint"
                        id="voting-endpoint"
                        className="endpoint"
                        value="voting.png"
                        onChange={handleChange}
                    />
                </div>
                <div className="image-container">
                    <label for="img">Select image:</label>
                    <input
                        type="file"
                        id="img"
                        name="img"
                        accept="image/*"
                        onChange={imageSelected} />
                </div>
                <input type="submit" />
            </form>
        </div>
    );
}

export default PhotoUpload;