import React, { useEffect, useState, useContext } from 'react';
import GameContext from '../GameContext'
import '../styles/HouseSelection.scss';

function HouseSelection(props) {
  const { myHouse,
    houseData,
    imageURL,
    gameState: { players },
    actions: { selectHouse, startGame } } = useContext(GameContext)

  useEffect(() => {
    if (myHouse) {
      selectHouse(myHouse);
    }
  }, []);

  function handleHouseSelection(e) {
    e.preventDefault();
    let houseID = e.target.parentElement.name;
    console.log(houseID)
    selectHouse(houseID);
  };

  const newHouse = () => {
    let buttons = [];
    Object.values(houseData).forEach(function (house) {
      let img_src = imageURL + "images/" + house.id;
      buttons.push(
        <div className="house-selection-container" key={house.houseName}>
          <div className="house-selection">
            <img className="house-crest" src={img_src} alt="" />
            <h3 className="house-motto">{house.motto}</h3>
          </div>
          <button className="house-selection-button" name={house.id} onClick={handleHouseSelection}><h1>{house.houseName}</h1><h3>{house.kingdom}</h3></button>
        </div>
      )
    });
    return <div>
      <h1>Please Select Your House: </h1>
      {buttons}
    </div>
  }

  const returningHouse = () => {
    return <div className="myHouse-container">
      <h1>Welcome Back {houseData[myHouse].houseName},</h1>
      <div className="house-selection myHouse-selection">
        <img className="house-crest" src={imageURL + "images/" + houseData[myHouse].id} alt="" />
        <h3 className="house-motto">{houseData[myHouse].motto}</h3>
      </div>
      <h3>waiting for the rest of the council to assemble...</h3>
      <h3>Current memebers of council present: </h3>
      <div className="joined-player-container">
        {Object.values(players).filter((player => player.house !== myHouse)).map((player) => (
          <div className="joined-player">
            <img className="house-crest-bullet" src={imageURL + "images/" + houseData[player.house].id} alt="" />
            <h4 className="joined-player-content">
              {houseData[player.house].houseName}, {houseData[player.house].kingdom}, <i>{houseData[player.house].motto}</i>
            </h4>
          </div>
        ))}
      </div>
      {myHouse === "solad" && <button onClick={() => startGame()}>Start</button>}
    </div>
  }

  const SVGSpinner =
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" width="40%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle className={'spinner'} cx={50} cy={50} r={25} />
        <circle className={'spinner-inner'} cx={50} cy={50} r={15} />
      </g>
    </svg>;


  let content;

  if (!houseData) {
    content = SVGSpinner;
  } else if (!myHouse) {
    content = newHouse();
  } else {
    content = returningHouse();
  }

  return <>
    {content}
  </>
}

export default HouseSelection;