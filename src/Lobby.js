import React, { useContext } from "react";
import GameContext from "./GameContext";

const Lobby = () => {
  const {
    myHouse,
    houseData,
    gameState: { players },
    actions: { selectHouse, startGame },
  } = useContext(GameContext);

  return (
    houseData && (
      <>
        <div>{myHouse && JSON.stringify(houseData[myHouse])}</div>
        <div>
          <h3>players joined:</h3>
          <ul>
            {Object.values(players).map((player) => (
              <li>{player.house}</li>
            ))}
          </ul>
        </div>
        <div>
          {!myHouse &&
            Object.values(houseData).map((house) => (
              <div onClick={() => selectHouse(house.id)}>{house.houseName}</div>
            ))}
        </div>
        <button onClick={() => startGame()}>Start</button>
      </>
    )
  );
};

export default Lobby;
