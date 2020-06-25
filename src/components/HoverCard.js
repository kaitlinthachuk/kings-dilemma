import React, { useState } from 'react';
import '../styles/HoverCard.scss';

// most of the code is from https://codepen.io/jarvis-ai/pen/GRJpQWO?editors=0110

function HoverCard(props) {

    const [rotate, setRotate] = useState({ x: 0, y: 0, z: 0, a: 0 });
    const [brightness, setBrightness] = useState(1);

    function handleMouseMove(e) {
        const bounding = mouseOverBoundingElem(e);
        const posX = bounding.width / 2 - bounding.x;
        const posY = bounding.height / 2 - bounding.y;
        const hypotenuseCursor = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
        const hypotenuseMax = Math.sqrt(Math.pow(bounding.width / 2, 2) + Math.pow(bounding.height / 2, 2));
        const ratio = hypotenuseCursor / hypotenuseMax;
        const maxTilt = 30;
        setRotate({ x: posY / hypotenuseCursor, y: -posX / hypotenuseCursor, z: 0, a: ratio * maxTilt });
        setBrightness(1.6 - bounding.y / bounding.height);
    }

    function mouseOverBoundingElem(e) {
        let bounding = e.target.getBoundingClientRect();
        let x = e.pageX - Math.round(bounding.left);
        let y = e.pageY - Math.round(bounding.top);

        return {
            x: Math.max(0, x),
            y: Math.max(0, y),
            width: Math.round(bounding.width),
            height: Math.round(bounding.height)
        };
    }

    const cardStyle = {
        transform: `rotate3d(${Object.values(rotate)}deg)`,
        filter: `brightness(${brightness})`,
    };

    return (
        <div
            className="card-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                setRotate({ x: 0, y: 0, z: 0, a: 0 });
                setBrightness(1);
            }}
        >
            <img
                className="card-image"
                src={`${props.image}?${new Date().getTime()}`}
                alt="voting card"
                style={cardStyle}
            ></img>
        </div>
    );
}

export default HoverCard;