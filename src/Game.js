import React, { useContext } from "react";
import GameContext from "./GameContext";
import Lobby from "./Lobby";
import SecretAgenda from "./SecretAgenda";

const Game = () => {
  const { gameState: {state} } = useContext(GameContext);

  const switchView = (state) => {
    switch (state) {
      case "lobby":
        return <Lobby />;
      case "gameOver":
        return <div>Game Over</div>;
      case "secretAgenda":
        return <SecretAgenda />;
      default:
        return <div>Loading...</div>;
    }
  };

  return switchView(state);
};

export default Game;
