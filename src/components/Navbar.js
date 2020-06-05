import React, { useState } from 'react';
import ImageModal from './ImageModal.js';
import { imagesMap } from '../Util.js';

import '../styles/Navbar.scss';

function Navbar(props) {
  const { isAdmin } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [imagePath, setImagePath] = useState("")

  function navClick(e) {
    e.preventDefault();
    setImagePath(imagesMap[e.target.id + ".png"]);
    setIsVisible(true);
  }

  function closeModal(e) {
    e.preventDefault();
    setIsVisible(false);
  };


  return (
    <>
      <div className='navbar-container'>
        <button className='navbar-button' id="map" onClick={navClick}>Map</button>
        <button className='navbar-button' id="lore" onClick={navClick}>Lore</button>
        <button className='navbar-button' id="rules" onClick={navClick}>Rules</button>
        <button className='navbar-button' id="stickers" onClick={navClick}>Chronicle Stickers</button>
        <button className='navbar-button' id="symbols" onClick={navClick}>Symbols Legend</button>
        {
          isAdmin && <button className='navbar-button' id="voting" onClick={props.votingOnClick}>Voting</button>
        }
        {
          isAdmin && <button className='navbar-button' id="tokens" onClick={props.tokenOnClick}>Assign Agenda Tokens</button>
        }
      </div>
      <ImageModal isVisible={isVisible} closeModal={closeModal} showClose='true' class="image-modal-container"
        images={[{ path: imagePath, onClick: e => e.preventDefault(), alt: "", class: "image-modal" }]} />
    </>
  );
}

export default Navbar;