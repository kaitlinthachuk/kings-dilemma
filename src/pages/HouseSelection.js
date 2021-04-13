import React, { useContext } from "react";
import GameContext from "../GameContext";
import "../styles/HouseSelection.scss";

function HouseSelection() {
  const {
    houseData,
    imageURL,
    actions: { selectHouse,
      updateCrave,
      updatePrestige },
  } = useContext(GameContext);

  function newHouseOnClick(house) {
    selectHouse(house);
    var prestige = prompt("Please enter your current prestige:", 0);
    updatePrestige(parseInt(prestige));
    var crave = prompt("Please enter your current crave:", 0);
    updateCrave(parseInt(crave));
  }

  const newHouse = () =>
    Object.values(houseData).map((house) => (
      <div className="house-selection-container" key={house.houseName}>
        <div className="house-selection">
          <img
            className="house-crest"
            src={imageURL + "images/" + house.id}
            alt=""
          />
          <h3 className="house-motto">{house.motto}</h3>
        </div>
        <button
          className="house-selection-button"
          name={house.id}
          onClick={() => newHouseOnClick(house.id)}
        >
          <h1>{house.houseName}</h1>
          <h3>{house.kingdom}</h3>
        </button>
      </div>
    ));

  const SVGSpinner = (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      width="40%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle className={"spinner"} cx={50} cy={50} r={25} />
        <circle className={"spinner-inner"} cx={50} cy={50} r={15} />
      </g>
    </svg>
  );

  return houseData ? (
    <>
      <h1>Please Select Your House:</h1>
      {newHouse()}
    </>
  ) : (
    SVGSpinner
  );
}

export default HouseSelection;
