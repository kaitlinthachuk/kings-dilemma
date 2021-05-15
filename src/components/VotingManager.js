import React, { useContext } from "react";
import VoteDisplay from "../components/VoteDisplay.js";
import VoteResult from "../components/VoteResult.js";
import HoverCard from "../components/HoverCard.js";
import GameContext from "../GameContext";

import "../styles/VotingManager.scss";

function VotingManager(props) {
  const {
    houseData,
    imageURL,
    gameState: { votes, availablePower, ayeOutcomes, nayOutcomes, state },
  } = useContext(GameContext);

  function getRandom(scale) {
    return (Math.random() * 2 - 1) * scale;
  }

  function buildPowerTokens(availablePower) {
    const powerTokens = [];

    while (availablePower > 0) {
      if (availablePower - 10 >= 0) {
        powerTokens.push(
          <img
            src={imageURL + "tokens/power-10.svg"}
            key={availablePower}
            alt="power-10"
            className="power-token token-med"
          />
        );
        availablePower -= 10;
      } else if (availablePower - 5 > 0) {
        powerTokens.push(
          <img
            src={imageURL + "tokens/power.svg"}
            key={availablePower}
            alt="power-5"
            className="power-token token-med"
          />
        );
        availablePower -= 5;
      } else {
        powerTokens.push(
          <img
            src={imageURL + "tokens/power.svg"}
            key={availablePower}
            alt="power-1"
            className="power-token token-small"
          />
        );
        availablePower--;
      }
    }

    return powerTokens;
  }

  return (
    <div
      className="voting-container"
      style={{ display: props.isVisible ? "" : "none" }}
    >
      <div className="aye-container" key="aye-container">
        <table className="aye" key="aye">
          <tbody>
            <tr>
              <th colSpan="2">Aye</th>
            </tr>
            {Object.values(votes)
              .filter((vote) => {
                return vote.type === "aye";
              })
              .map((vote) => {
                return (
                  <tr key={vote.house}>
                    <td>{houseData[vote.house].houseName}</td>
                    <td>{vote.power}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="voting-card-container">
        <HoverCard />
      </div>
      <div className="nay-container" key="nay-container">
        <table className="nay" key="nay">
          <tbody>
            <tr>
              <th colSpan="2">Nay</th>
            </tr>
            {Object.values(votes)
              .filter((vote) => {
                return vote.type === "nay";
              })
              .map((vote) => {
                return (
                  <tr key={vote.house}>
                    <td>{houseData[vote.house].houseName}</td>
                    <td>{vote.power}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="aye-scale">
        <img
          src={imageURL + "tokens/aye-scale.svg"}
          key="scales"
          alt="scales"
        />
        <div className="aye-token-container">
          {ayeOutcomes.map((outcome, i) => (
            <img
              src={
                imageURL +
                "tokens/outcome-" +
                outcome.resource +
                "-" +
                outcome.type +
                ".svg"
              }
              key={outcome.resource + "-" + outcome.type}
              alt="outcome"
              className="aye-outcome-token token-med"
              style={{
                transform: `translate(${i * getRandom(10)}px, ${
                  i * getRandom(10)
                }px) rotate(${getRandom(30)}deg)`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="nay-scale">
        <img
          src={imageURL + "tokens/nay-scale.svg"}
          key="scales"
          alt="scales"
        />
        <div className="nay-token-container">
          {nayOutcomes.map((outcome, i) => (
            <img
              src={
                imageURL +
                "tokens/outcome-" +
                outcome.resource +
                "-" +
                outcome.type +
                ".svg"
              }
              key={outcome.resource + "-" + outcome.type}
              alt="outcome"
              className="nay-outcome-token token-med"
              style={{
                transform: `translate(${i * getRandom(10)}px, ${
                  i * getRandom(10)
                }px) rotate(${getRandom(30)}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="available-power">
        {buildPowerTokens(availablePower)}

        <div className="pass-houses">
          {state !== "voteOver" &&
            Object.values(votes)
              .filter((vote) => {
                return vote.type === "gather";
              })
              .map((vote) => {
                return <h3>{houseData[vote.house].houseName}</h3>;
              })}
        </div>
      </div>
      {state === "voteOver" && <VoteResult />}
      {state === "voting" && <VoteDisplay />}
    </div>
  );
}

export default VotingManager;
