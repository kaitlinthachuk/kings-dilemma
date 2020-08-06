import React, { useState } from 'react';
import ImageModal from './ImageModal.js';

import '../styles/Navbar.scss';
const baseURL = 'https://res.cloudinary.com/didsjgttu/image/upload/';


function Navbar(props) {
  const { isAdmin } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [imagePath, setImagePath] = useState("")

  function navClick(e) {
    e.preventDefault();

    if (e.target.id === "rules") {
      const url = 'https://www.dropbox.com/s/5r4tvqpg7obi698/KID_RULEBOOK_v35_20191009.pdf?dl=0';
      window.open(url, '_blank');
    } else {
      setImagePath(baseURL + "images/" + e.target.id + ".png");
      if (e.target.id === 'stickers') {
        setImagePath(`${e.target.id + ".png"}?${new Date().getTime()}`);
      }
      setIsVisible(true);
    }


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
          isAdmin && <button className='navbar-button' id="tokens" onClick={props.tokenOnClick}>Agenda Tokens</button>
        }
        {
          isAdmin && <button className='navbar-button' id="end" onClick={props.endOnClick}>End Game</button>
        }
      </div>
      <ImageModal isVisible={isVisible} closeModal={closeModal} showClose='true' class="image-modal-container"
        images={[{ path: imagePath, onClick: e => e.preventDefault(), alt: "", class: "image-modal" }]} />
    </>
  );
}

export default Navbar;