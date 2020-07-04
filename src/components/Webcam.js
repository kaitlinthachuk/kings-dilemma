import React, { useState, useEffect } from 'react';
// import Jitsi from 'react-jitsi';
import { database } from '../firebase.js';

// import '../styles/Webcam.scss';


function Webcam(props) {
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        database.ref('session/id').once('value', (snapshot) => {
            setRoomName(snapshot.val());
        });

        //     let iFrame = document.querySelector('iframe');

        //     if (iFrame) {
        //         let cssLink = document.createElement("link");
        //         cssLink.href = "Webcam.scss";
        //         cssLink.rel = "stylesheet";
        //         cssLink.type = "text/css";
        //         iFrame.contentDocument.head.appendChild(cssLink);
        //    }

    }, []);

    const domain = 'meet.jit.si';
    const options = {
        roomName: roomName,
        configOverwrite: { startWithAudioMuted: true, startWithVideoMuted: true },
        interfaceConfigOverwrite: { filmStripOnly: true, TOOLBAR_BUTTONS: [], SHOW_JITSI_WATERMARK: false },
    };

    // eslint-disable-next-line no-undef
    let api = new JitsiMeetExternalAPI(domain, options);
    const iframe = api.getIFrame();
    let cssLink = document.createElement("link");
    cssLink.href = "Webcam.scss";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    iframe.contentDocument.head.appendChild(cssLink);

    console.log(iframe);


    return (<>
        {props.isVisible && <div dangerouslySetInnerHTML={{ __html: iframe }} />}
    </>
    )
}

export default Webcam;