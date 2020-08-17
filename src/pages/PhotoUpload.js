import React, { useState, useRef } from 'react';

import "../styles/PhotoUpload.scss";
import { database } from '../firebase';

function PhotoUpload(props) {
    const [imageEndpoint, setImageEndpoint] = useState("");
    const [successful, setSuccessful] = useState(false);
    const fileInput = useRef();

    function handleChange(e) {
        e.preventDefault();
        setImageEndpoint(e.target.value);
    }

    function handleSubmit(e) {
        setSuccessful(false);
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', fileInput.current.files[0]);
        formData.append('upload_preset', 'l8ge128e');

        fetch('https://api.cloudinary.com/v1_1/didsjgttu/image/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                let reff = imageEndpoint === "stickers" ? "stickers_url" : "voting_url";
                database.ref("session/" + reff).set(res.secure_url).then(setSuccessful(true));
            })
            .catch(err => console.log(err));
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
                        value="stickers"
                        onChange={handleChange}
                        checked={imageEndpoint === "stickers"}
                    />
                    <label htmlFor="voting-endpoint">Voting Card</label>
                    <input
                        type="radio"
                        name="image-endpoint"
                        id="voting-endpoint"
                        className="endpoint"
                        value="voting"
                        onChange={handleChange}
                        checked={imageEndpoint === "voting"}
                    />
                </div>
                <div className="image-container">
                    <label htmlFor="img">Select image:</label>
                    <input
                        type="file"
                        ref={fileInput} />
                </div>
                <input type="submit" />
            </form>


            {
                successful && <h2> Photo uploaded!!</h2>
            }
        </div>
    );
}

export default PhotoUpload;