import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import GameContext from '../GameContext'
import '../styles/HouseSelection.scss';

function HouseSelection(props) {
  const { serverURL, imageURL } = useContext(GameContext)
  const [loading, setLoading] = useState(true);
  const [house, setHouse] = useState(null);
  const [otherHouses, setOtherHouses] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(serverURL + "/houses")
      .then(res => {
        res.json().then(houses => {
          setOtherHouses(Object.values(houses))
          setLoading(false)
        })
      })
  }, []);

  function handleHouseSelection(e) {
    e.preventDefault();
    debugger;
    console.log(e.target.parentElement);
    let houseID = e.target.parentElement.name;
    console.log(houseID)
    for (let i = 0; i < otherHouses.length; i++) {
      if (otherHouses[i].id === houseID) {
        setHouse(otherHouses[i]);
        setRedirect(true);
        break;
      }
    }
  };

  const newHouse = () => {
    let buttons = [];
    otherHouses.forEach(function (house) {
      let img_src = imageURL + "images/" + house.id;
      console.log(img_src);
      buttons.push(
        <div className="house-selection-container" key={house.houseName}>
          <div className="house-selection">
            <img className="house-crest" src={img_src} alt="" />
            <h3 className="house-motto">{house.motto}</h3>
          </div>
          <button className="house-selection-button" name={house.id} onClick={handleHouseSelection}><h1>{house.houseName}</h1><h3>{house.kingdom}</h3></button>
        </div>
      )
    });
    return <div>
      <h1>Please Select Your House</h1>
      {buttons}
    </div>
  }

  const SVGSpinner =
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" width="40%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle className={'spinner'} cx={50} cy={50} r={25} />
        <circle className={'spinner-inner'} cx={50} cy={50} r={15} />
      </g>
    </svg>;


  let content;

  if (loading) {
    content = SVGSpinner;
  } else if (redirect) {
    content = <Redirect to={{ pathname: '/play', state: { houseState: house } }} />;
  } else {
    content = newHouse();
  }

  return <>
    {content}
  </>
}

export default HouseSelection;