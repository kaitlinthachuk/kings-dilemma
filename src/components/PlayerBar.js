import React, { useContext } from "react";
import GameContext from "../GameContext";

import "../styles/PlayerBar.scss";

function PlayerBar() {
  const {
    myHouse,
    imageURL,
    gameState: { players, message },
  } = useContext(GameContext);

  const coinSrc = imageURL + "tokens/coin.svg";
  const powerSrc = imageURL + "tokens/power.svg";

  return (
    <>
      <div className="player-area">
        <div className="message-board-container">{message}</div>
        {players[myHouse]?.secretAgenda && (
          <img
            className="secret-agenda-card"
            src={`${imageURL}/agendas/${players[myHouse].secretAgenda.name}`}
            alt="secret agenda card"
          />
        )}
      </div>
      <div className="tokens-container">
        <div className="playerbar-value">
          <img
            src={coinSrc}
            className="token-small playerbar-token"
            id="coin-svg"
            alt="coins"
          />
          <span>{players[myHouse]?.coins}</span>
        </div>
        <div className="playerbar-value">
          <img
            src={powerSrc}
            className="token-small playerbar-token"
            id="power-svg"
            alt="power"
          />
          <span>{players[myHouse]?.power}</span>
        </div>
      </div>
    </>
  );
}

export default PlayerBar;
