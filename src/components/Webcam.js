import React, { useContext, useEffect } from "react";
import GameContext from "../GameContext";

import "../styles/Webcam.scss";
function Webcam(props) {
  const { webcamRoomId } = useContext(GameContext);

  useEffect(() => buildJitsi(webcamRoomId), [webcamRoomId]);

  function buildJitsi(roomName) {
    const domain = "meet.jit.si";
    const options = {
      roomName: roomName,
      parentNode: document.getElementById("jitsi-container"),
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [],
        VIDEO_QUALITY_LABEL_DISABLED: true,
        SHOW_CHROME_EXTENSION_BANNER: false, // not working currently but apparently pull request is being merged as of a few days ago
        ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 0,
        INITIAL_TOOLBAR_TIMEOUT: 0, // also not working currently
        TOOLBAR_TIMEOUT: 0,
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
    };

    const api = new JitsiMeetExternalAPI(domain, options); // eslint-disable-line
    api.executeCommand("toggleFilmStrip");
    api.executeCommand("subject", " ");
  }

  return (
    <>
      <div id="jitsi-container" hidden={!props.isVisible}></div>
    </>
  );
}

export default Webcam;
