import React, { useState, useEffect } from 'react';
import Jitsi from 'react-jitsi';
import { database } from '../firebase.js';


function Webcam(props) {
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        database.ref('session/id').once('value', (snapshot) => {
            setRoomName(snapshot.val());
        });

    }, []);


    return (<>
        {props.isVisible && <Jitsi roomName={roomName}
            configOverwrite={{ startWithAudioMuted: true, startWithVideoMuted: true }}
            interfaceConfigOverwrite={{ filmStripOnly: true, TOOLBAR_BUTTONS: [], SHOW_JITSI_WATERMARK: false }} />}
    </>
    )
}

export default Webcam;