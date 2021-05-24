import React, { useContext, useState } from "react";
import GameContext from "../GameContext";

import "../styles/VoteDisplay.scss";

function VoteTurn() {
  const {
    myHouse,
    gameState: { votes, becomeModAvailable },
    actions: { playerVote },
  } = useContext(GameContext);

  const [intermediateVote, setIntermediateVote] = useState("");
  const [intermediatePower, setIntermediatePower] = useState(0);

  const backgroundSwitch = {
    aye: "background-blue",
    nay: "background-red",
    mod: "background-yellow",
    gather: "background-yellow",
  };

  function voteClick(choice) {
    console.log("vote click");
    if (choice === "mod") {
      playerVote({ house: myHouse, type: "mod", power: 0 });
    }

    if (choice === "gather") {
      playerVote({ house: myHouse, type: "gather", power: 0 });
    }
    console.log(choice);
    setIntermediateVote(choice);
  }

  function commitPower() {
    playerVote({
      house: myHouse,
      type: intermediateVote,
      power: intermediatePower,
    });
  }

  function handleChange(e) {
    setIntermediatePower(parseInt(e.target.value));
  }

  let content;

  if (!votes[myHouse] && !intermediateVote) {
    content = (
      <div className="select-vote">
        <input
          type="button"
          className="nay-button"
          name="vote"
          value="Nay"
          onClick={() => voteClick("nay")}
        />
        {becomeModAvailable && (
          <input
            type="button"
            className="pass-button"
            name="vote"
            value="Pass & Become Moderator"
            onClick={() => voteClick("mod")}
          />
        )}
        <input
          type="button"
          className="pass-button"
          name="vote"
          value="Pass & Gather Power"
          onClick={() => voteClick("gather")}
        />
        <input
          type="button"
          className="aye-button"
          name="vote"
          value="Aye"
          onClick={() => voteClick("aye")}
        />
      </div>
    );
  } else {
    const currentPowerComitted = votes[myHouse] ? votes[myHouse].power : 0;
    const currentChoice = votes[myHouse]
      ? votes[myHouse].type
      : intermediateVote;
    let background;

    if (!votes[myHouse] && intermediateVote) {
      background = backgroundSwitch[intermediateVote];
    } else if (votes[myHouse]) {
      background = backgroundSwitch[votes[myHouse].type];
    } else {
      background = "";
    }

    if (currentChoice === "gather" || currentChoice === "mod") {
      content = (
        <div className={`add-power-container ${background}`}>
          <h1 className="add-power add-power-header">Pass</h1>
        </div>
      );
    } else {
      content = (
        <div className={`add-power-container ${background}`}>
          <h1 className="add-power add-power-header">{currentChoice}</h1>
          <h2 className="add-power add-power-header">
            Current Power Comitted: {currentPowerComitted}
          </h2>
          <input
            type="number"
            className="add-power-input add-power"
            name="add-power"
            autoFocus
            onFocus={(e) => e.target.select()}
            value={intermediatePower}
            onChange={handleChange}
          />
          <input
            type="button"
            className="add-power-button add-power"
            name="add-power-button"
            value="Vote!"
            disabled={intermediatePower === 0}
            onClick={commitPower}
          />
        </div>
      );
    }
  }

  return <>{content}</>;
}

export default VoteTurn;
