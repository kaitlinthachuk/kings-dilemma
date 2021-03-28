import React, { useContext } from "react";
import GameContext from "./GameContext";
import HouseSelection from "./pages/HouseSelection"
import GamePlay from "./pages/Gameplay"

const ViewSwitch = () => {
  const { gameState: { state } } = useContext(GameContext);

  const switchView = (state) => {
    switch (state) {
      case "lobby":
        return <HouseSelection />;
      case "secretAgenda":
      case "voting":
      case "voteOver":
      case "gameOver":
      case "default":
        return <GamePlay />;
      default:
        return <div>Loading...</div>;
    }
  };

  return switchView(state);
};

export default ViewSwitch;
