import React, { useContext } from "react";
import GameContext from "./GameContext";
import HouseSelection from "./pages/HouseSelection";
import GamePlay from "./pages/Gameplay";
import { Lobby } from "./pages/Lobby";

const ViewSwitch = () => {
  const {
    myHouse,
    gameState: { state },
  } = useContext(GameContext);

  const switchView = (state) => {
    switch (state) {
      case "lobby":
        return <Lobby />;
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

  return myHouse ? switchView(state) : <HouseSelection />;
};

export default ViewSwitch;
