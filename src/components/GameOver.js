import React, { useContext } from "react";
import GameContext from "../GameContext";

import "../styles/GameOver.scss";

function GameOver(props) {
  const {
    houseData,
    gameState: { players },
  } = useContext(GameContext);

  return (
    <div
      className="end-game-container"
      style={{ display: props.isVisible ? "" : "none" }}
    >
      <div className="table-container">
        <div className="power-container" key="power-container">
          <table className="power" key="power">
            <tbody>
              <tr>
                <th colSpan="2">Power</th>
              </tr>
              {Object.values(players)
                .sort((a, b) => {
                  return b.power - a.power;
                })
                .map((player) => {
                  return (
                    <tr key={player.house}>
                      <td>{houseData[player.house].houseName}</td>
                      <td>{player.power}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="coins-container" key="coins-container">
          <table className="coins" key="coins">
            <tbody>
              <tr>
                <th colSpan="2">Coins</th>
              </tr>
              {Object.values(players)
                .sort((a, b) => {
                  return b.coins - a.coins;
                })
                .map((player) => {
                  return (
                    <tr key={player.house}>
                      <td>{houseData[player.house].houseName}</td>
                      <td>{player.coins}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
