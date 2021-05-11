import React, { useContext } from "react";
import GameContext from "../GameContext";

import "../styles/VoteDisplay.scss";

function VoteWait() {
  const {
    myHouse,
    gameState: { votes },
  } = useContext(GameContext);

  let content;
  let background = "";
  if (!votes[myHouse]) {
    content = <h1>Waiting For Your Turn....</h1>;
  } else {
    if (votes[myHouse].type === "aye") {
      background = "background-blue";
    } else if (votes[myHouse].type === "nay") {
      background = "background-red";
    } else {
      background = "background-yellow";
    }

    content = (
      <div className={`add-power-container ${background}`}>
        <h1 className="add-power add-power-header">{votes[myHouse].type}</h1>
        <h2 className="add-power add-power-header">
          Current Power Comitted: {votes[myHouse].power}
        </h2>
      </div>
    );
  }
  return <>{content}</>;
}

export default VoteWait;
