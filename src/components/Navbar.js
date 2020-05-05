import React from 'react';

import '../styles/Navbar.scss';

function Navbar(props) {
  const { isAdmin } = props;

  function navClick(e) {
    e.preventDefault();
    console.log(e.target);
  }


  return (
    <div className='navbar-container'>
      <button className='navbar-button' id="#map" onClick={navClick}>Map</button>
      <button className='navbar-button' id="#lore" onClick={navClick}>Lore</button>
      <button className='navbar-button' id="#rule" onClick={navClick}>Rules</button>
      <button className='navbar-button' id="#stickers" onClick={navClick}>Chronicle Stickers</button>
      {
        isAdmin ? <button className='navbar-button' id="#voting" onClick={navClick}>Start Voting</button> :
          null
      }
    </div>
  );
}

export default Navbar;