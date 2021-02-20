import React, { useState, useLayoutEffect } from 'react';

function AspectRatioBox(props) {

    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        handleResize(); // for initial load if causes problems try useEffectLayout as suggested by react docs
        window.addEventListener('resize', handleResize);
        return (() => window.removeEventListener('resize', handleResize));
    });

    function handleResize() {
        const availableWidth = document.body.scrollWidth - 300; // 300 from sidebar width
        const availableHeight = document.body.scrollHeight - 60 - 180; // 60 nav and 180 playerbar
        const scale = Math.min(
            availableWidth / 1280,
            availableHeight / 720,
            1,
        );
        setScale(scale);
    }

    return (
        <div
            style={{
                transform: `scale(${scale})`,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <div style={{ gridArea: 'main', position: 'absolute' }}>
                {props.children}
            </div>
        </div>
    );
}

export default AspectRatioBox;