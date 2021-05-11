import React, { useContext } from "react";
import GameContext from "../GameContext";
import VoteWait from "./VoteWait";
import VoteTurn from "./VoteTurn";

import "../styles/VoteDisplay.scss";

function VoteDisplay() {
  const {
    myHouse,
    gameState: { turn },
  } = useContext(GameContext);

  return (
    <div className="voting-display-container">
      {turn !== myHouse && <VoteWait />}
      {turn === myHouse && <VoteTurn />}
    </div>
  );
}

export default VoteDisplay;
