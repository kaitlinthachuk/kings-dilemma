import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import { database } from '../firebase.js';
import { imagesMap, initUrls } from '../Util.js';

import '../styles/HouseSelection.scss';

function HouseSelection(props) {

  const [loading, setLoading] = useState(true);
  const [house, setHouse] = useState(null);
  const [otherHouses, setOtherHouses] = useState([]);
  const [redirect, setRedirect] = useState(false);


  let isError = false,
    errorMsg = null;

  useEffect(() => {
    initUrls().then(() => {
      database.ref('/houses/').once('value').then(function (snapshot) {
        let fetchedHouses = [];
        snapshot.forEach((child) => {
          let val = child.toJSON();
          val['agenda'] = null;
          fetchedHouses.push(val);
        })
        setLoading(false);
        setOtherHouses(fetchedHouses);

      }).catch(err => {
        isError = true;
        errorMsg = err;
      });
    })
  }, []);

  function handleHouseSelection(e) {
    e.preventDefault();
    let houseName = e.target.parentElement.name;
    for (let i = 0; i < otherHouses.length; i++) {
      if (otherHouses[i].key === houseName) {
        setHouse(otherHouses[i]);
        database.ref().update({
          ['session/' + otherHouses[i].key + "/coins"]: otherHouses[i].coins,
          ['session/' + otherHouses[i].key + "/power"]: otherHouses[i].power,
        });

        setRedirect(true);
        break;
      }
    }

  };

  const newHouse = () => {
    let buttons = [];
    otherHouses.forEach(function (house) {
      let img_src = imagesMap[house.key + "-small.png"];
      buttons.push(
        <div className="house-selection-container" key={house.name}>
          <div className="house-selection">
            <img className="house-crest" src={img_src} alt="" />
            <h3 className="house-motto">{house.motto}</h3>
          </div>
          <button className="house-selection-button" name={house.key} onClick={handleHouseSelection}><h1>{house.name}</h1></button>
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
  } else if (isError) {
    content = <div>Something broke! {errorMsg} </div>;
  } else if (redirect) {
    content = <Redirect to={{ pathname: '/play', state: { houseState: house, otherHousesState: otherHouses } }} />;
  } else {
    content = newHouse();
  }

  return <>
    {content}
  </>
}

export default HouseSelection;