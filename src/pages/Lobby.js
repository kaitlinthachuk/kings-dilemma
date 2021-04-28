import React, { useContext } from "react";
import GameContext from "../GameContext";

export const Lobby = () => {
  const {
    myHouse,
    houseData,
    imageURL,
    gameState: { players },
    actions: { startGame },
  } = useContext(GameContext);

  return (
    <div className="myHouse-container">
      <h1>Welcome Back {houseData[myHouse].houseName},</h1>
      <div className="house-selection myHouse-selection">
        <img
          className="house-crest"
          src={imageURL + "images/" + houseData[myHouse].id}
          alt=""
        />
        <h3 className="house-motto">{houseData[myHouse].motto}</h3>
      </div>
      <h3>waiting for the rest of the council to assemble...</h3>
      <h3>Current memebers of council present: </h3>
      <div className="joined-player-container">
        {Object.values(players)
          .filter((player) => player.house !== myHouse)
          .map((player) => (
            <div className="joined-player">
              <img
                className="house-crest-bullet"
                src={imageURL + "images/" + houseData[player.house].id}
                alt=""
              />
              <h4 className="joined-player-content">
                {houseData[player.house].houseName},{" "}
                {houseData[player.house].kingdom},{" "}
                <i>{houseData[player.house].motto}</i>
              </h4>
            </div>
          ))}
      </div>
    </div>
  );
};
