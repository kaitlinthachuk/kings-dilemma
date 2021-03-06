import React, { useContext, useState } from "react";
import GameContext from "../GameContext";

import "../styles/VoteResult.scss";

function VoteResult() {
  const {
    myHouse,
    houseData,
    gameState: { leaderTie, leaderChoice, voteTie, winner, moderator },
    actions: { breakTie, breakLeaderTie },
  } = useContext(GameContext);

  const [modChoice, setModChoice] = useState("");
  const [modLeaderChoice, setModLeaderChoice] = useState("");

  let content = [],
    backgroundColor;

  if ((winner === "aye" || winner === "nay") && !leaderTie) {
    backgroundColor = winner === "aye" ? "background-blue" : "background-red";
    content = (
      <div className={`winner-container ${backgroundColor}`}>
        <h1 className="winner">{winner.toUpperCase()} Wins!</h1>
      </div>
    );
  } else {
    if (voteTie) {
      if (myHouse === moderator) {
        content.push(
          <div className="tie-break-container">
            <label className="tie-break-input-label tie-break" htmlFor="aye">
              Aye
            </label>
            <input
              type="radio"
              name="tie-breaker"
              id="aye"
              className="tie-break-input tie-break"
              value="aye"
              onChange={() => setModChoice("aye")}
              checked={modChoice === "aye"}
            />
            <label className="tie-break-input-label tie-break" htmlFor="nay">
              Nay
            </label>
            <input
              type="radio"
              name="tie-breaker"
              id="nay"
              className="tie-break-input tie-break"
              value="nay"
              onChange={() => setModChoice("nay")}
              checked={modChoice === "nay"}
            />
            <input
              type="button"
              className="tie-break-button tie-break"
              name="tie-breaker"
              value="Break Tie!"
              onClick={() => breakTie(modChoice)}
            />
          </div>
        );
      } else {
        content.push(
          <div className="background-yellow tie-wait">
            <h2>Moderator Needs to Break the Tie!</h2>
          </div>
        );
      }
    } else if (leaderTie) {
      if (myHouse === moderator) {
        content.push(
          <div className="tie-leader-container">
            {leaderChoice.map((house) => {
              return (
                <>
                  <label
                    className="tie-leader-input-label tie-leader"
                    htmlFor={house}
                  >
                    {houseData[house].houseName}
                  </label>
                  <input
                    type="radio"
                    name="tie-leader"
                    className="tie-leader-input tie-leader"
                    value={house}
                    onChange={() => setModLeaderChoice(house)}
                    checked={modLeaderChoice === house}
                  />
                </>
              );
            })}

            <input
              type="button"
              className="tie-leader-button tie-break"
              name="tie-breaker-leader"
              value="Choose Leader"
              onClick={() => breakLeaderTie(modLeaderChoice)}
            />
          </div>
        );
      } else {
        content.push(
          <div className="background-yellow tie-wait">
            <h2> Moderator Needs to Choose a Leader! </h2>
          </div>
        );
      }
    }
  }

  return <div className="voting-result-container">{content}</div>;
}

export default VoteResult;
