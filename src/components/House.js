import React, { useContext } from "react";
import GameContext from "../GameContext";

function House({ player }) {
  const {
    imageURL,
    houseData,
    gameState: { turn, leader, moderator },
  } = useContext(GameContext);

  let imgSrc = imageURL + "images/" + player.house;

  function createTokens() {
    let tokenArray = player.agendaTokens.map((token) => {
      let tokenString = token.resource + "-" + token.type;
      return (
        <img
          className="token-small"
          src={imageURL + "tokens/" + tokenString}
          alt={tokenString}
          key={tokenString}
        />
      );
    });

    if (player.house === leader) {
      tokenArray.push(
        <img
          className="token-small"
          src={imageURL + "tokens/leader"}
          alt="leader"
          key="leader"
        />
      );
    }
    if (player.house === moderator) {
      tokenArray.push(
        <img
          className="token-small"
          src={imageURL + "tokens/moderator"}
          alt="moderator"
          key="moderator"
        />
      );
    }

    return tokenArray;
  }

  return (
    <div
      className={`menu-house ${turn === player.house ? "selected-turn" : ""}`}
    >
      <div className="token-container" key="token-container">
        {createTokens()}
      </div>
      <div
        className="house-container"
        key={player.house + "-house"}
        style={{ backgroundImage: `url(${imgSrc})` }}
      >
        <h5 className="house-name" key={player.house}>
          {houseData[player.house].houseName}
        </h5>
      </div>
    </div>
  );
}

export default House;
