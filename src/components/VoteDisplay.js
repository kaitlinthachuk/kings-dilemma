import React, { useState, useContext } from "react";
import GameContext from "../GameContext";

import "../styles/VoteDisplay.scss";

function VoteDisplay(props) {
  const {
    myHouse,
    gameState: { votes, turn, players, becomeModAvailable },
    actions: { playerVote },
  } = useContext(GameContext);

  const [intermediateVote, setIntermediateVote] = useState({});
  const [addedPower, setAddedPower] = useState(0);
  const [firstVote, setFirstVote] = useState(true);

  function voteClick(choice) {
    console.log("vote click");
    let color = "background-yellow";

    if (choice === "aye") {
      color = "background-blue";
    } else if (choice === "nay") {
      color = "background-red";
    }

    if (choice === "mod") {
      playerVote({ house: myHouse, type: "mod", power: 0 });
    }

    if (choice === "gather") {
      playerVote({ house: myHouse, type: "gather", power: 0 });
    }

    setIntermediateVote({
      vote: choice,
      color: color,
    });
    setFirstVote(false);
  }

  function commitPower() {
    playerVote({
      house: myHouse,
      type: intermediateVote.vote,
      power: addedPower,
    });
    setFirstVote(true);
  }

  function handleChange(e) {
    setAddedPower(parseInt(e.target.value));
  }

  let content;

  if (turn !== myHouse && !votes[players.house]) {
    content = <h1>Waiting For Your Turn....</h1>;
  } else if (turn === myHouse && firstVote && !votes[players.house]) {
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
          onClick={() => voteClick("power")}
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
    const showAddPower =
      (votes[myHouse] &&
        (votes[myHouse].type === "aye" || votes[myHouse].type === "nay")) ||
      intermediateVote.vote === "aye" ||
      intermediateVote.vote === "nay"
        ? true
        : false;

    console.log(showAddPower);
    content = (
      <div className={`add-power-container ${intermediateVote["color"]}`}>
        <h1 className="add-power add-power-header">
          {intermediateVote["vote"]}
        </h1>
        {showAddPower && (
          <>
            {" "}
            <h2 className="add-power add-power-header">
              Current Power Comitted: {currentPowerComitted}
            </h2>
            {turn === myHouse && (
              <input
                type="number"
                className="add-power-input add-power"
                name="add-power"
                placeholder="1"
                onChange={handleChange}
              />
            )}
            {turn === myHouse && (
              <input
                type="button"
                className="add-power-button add-power"
                name="add-power-button"
                value="Vote!"
                onClick={commitPower}
              />
            )}
          </>
        )}
      </div>
    );
  }

  return <div className="voting-display-container">{content}</div>;
}

export default VoteDisplay;
