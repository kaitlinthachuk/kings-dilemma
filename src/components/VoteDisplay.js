import React, { useState, useContext } from "react";
import GameContext from "../GameContext";

import "../styles/VoteDisplay.scss";

function VoteDisplay() {
  const {
    myHouse,
    gameState: { votes, turn, becomeModAvailable },
    actions: { playerVote },
  } = useContext(GameContext);

  const [addedPower, setAddedPower] = useState(1);
  const [intermediateVote, setIntermediateVote] = useState("");

  function getColor(voteType) {
    switch (voteType) {
      case "aye":
        return "background-blue";
      case "nay":
        return "background-red";
      default:
        return "background-yellow";
    }
  }

  function buildVoteDisplay() {
    // && !votes[myHouse]
    //1
    if (turn !== myHouse && !votes[myHouse]) {
      return <h1>Waiting For Your Turn...</h1>;
    }

    //3
    if (turn !== myHouse && votes[myHouse]) {
      return (
        <div className={`add-power-container ${getColor(votes[myHouse].type)}`}>
          <h1 className="add-power add-power-header">
            {intermediateVote["vote"]}
          </h1>

          <h2 className="add-power add-power-header">
            Current Power Comitted: {votes[myHouse]?.power || 0}
          </h2>
        </div>
      );
    }

    //4
    if (
      (turn === myHouse && votes[myHouse]?.type === "aye") ||
      votes[myHouse]?.type === "nay" ||
      intermediateVote.length > 0
    ) {
      return (
        <div className={`add-power-container ${getColor(intermediateVote)}`}>
          <h1 className="add-power add-power-header">
            {intermediateVote["vote"]}
          </h1>
          <h2 className="add-power add-power-header">
            Current Power Comitted: {votes[myHouse]?.power || 0}
          </h2>
          {turn === myHouse && (
            <input
              type="number"
              className="add-power-input add-power"
              value={addedPower}
              onChange={(e) => setAddedPower(parseInt(e.target.value))}
            />
          )}
          {turn === myHouse && (
            <button
              className="add-power-button add-power"
              onClick={() =>
                playerVote({
                  house: myHouse,
                  type: intermediateVote,
                  power: addedPower,
                })
              }
            >
              Vote!
            </button>
          )}
        </div>
      );
    }

    //2
    if (turn === myHouse && !votes[myHouse]) {
      return (
        <div className="select-vote">
          <button
            className="nay-button"
            onClick={() => setIntermediateVote("nay")}
          >
            Nay
          </button>
          {becomeModAvailable && (
            <button
              className="pass-button"
              onClick={() =>
                playerVote({ house: myHouse, type: "mod", power: 0 })
              }
            >
              Pass & Become Moderator
            </button>
          )}
          <button
            className="pass-button"
            onClick={() =>
              playerVote({ house: myHouse, type: "gather", power: 0 })
            }
          >
            Pass & Gather Power
          </button>
          <button
            className="aye-button"
            onClick={() => setIntermediateVote("aye")}
          >
            Aye
          </button>
        </div>
      );
    }
  }

  return <div className="voting-display-container">{buildVoteDisplay()}</div>;
}

export default VoteDisplay;
