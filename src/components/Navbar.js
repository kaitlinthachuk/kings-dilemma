import React, { useState } from 'react';
import ImageModal from './ImageModal.js'

import '../styles/Navbar.scss';

function Navbar(props) {
  const { isAdmin } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [imagePath, setImagePath] = useState("")

  function navClick(e) {
    e.preventDefault();
    setImagePath("images/" + e.target.id + ".png");
    setIsVisible(true);
  }

  return (
    <>
      <div className='navbar-container'>
        <button className='navbar-button' id="map" onClick={navClick}>Map</button>
        <button className='navbar-button' id="lore" onClick={navClick}>Lore</button>
        <button className='navbar-button' id="rules" onClick={navClick}>Rules</button>
        <button className='navbar-button' id="stickers" onClick={navClick}>Chronicle Stickers</button>
        <button className='navbar-button' id="symbols" onClick={navClick}>Symbols Legend</button>
        {
          isAdmin ? <button className='navbar-button' id="#voting" onClick={navClick}>Start Voting</button> :
            null
        }
      </div>
      <ImageModal isVisible={isVisible} images={[{ path: imagePath, onClick: null, alt: "" }]} />
    </>
  );
}

export default Navbar;