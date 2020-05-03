import React, { useEffect, useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import { storage, constants } from '../utils.js';
import { database } from '../firebase.js';


import '../styles/HouseSelection.scss';

const images = require.context('../assets/images', true);

function HouseSelection(props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [house, setHouse] = useState(null);
  const [otherHouses, setOtherHouses] = useState([]);


  const storedHouse = () => {
    let img_str = "./" + house.key + "-small.png";
    let img_src = images(img_str);
    return <div>
      <h1>Welcome to the King's Dilemma</h1>
      <h3>The council is waiting for you</h3>
      <h5>{house.name}</h5>
      <h5>{house.kingdom}</h5>
      <img className="house-crest-selected" src={img_src} alt="" />
      <h5>{house.motto}</h5>
    </div>
  };

  const newHouse = () => {
    let buttons = [];
    otherHouses.forEach(function (house) {
      let img_str = "./" + house.key + "-small.png";
      let img_src = images(img_str);
      buttons.push(
        <div className="house-selection-container">
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
    //<div className="spinner-container">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle className={'spinner'} cx={50} cy={50} r={25} />
        <circle className={'spinner-inner'} cx={50} cy={50} r={15} />
      </g>
    </svg>;

  // </div>;
  let isError = false,
    errorMsg = null;

  useEffect(() => {
    database.ref('/houses').once('value')
      .then(function (snapshot) {
        let fetchedHouses = [];
        snapshot.forEach((child) => {
          fetchedHouses.push(child.toJSON());
        })
        setLoading(false);
        setOtherHouses(fetchedHouses);
      }, function (error) {
        isError = true;
        errorMsg = error;
      });

    if (localStorage.getItem('house')) {
      storeHouse(localStorage.getItem('house').name)
    }

  }, []);

  function storeHouse(houseName) {
    for (let i = 0; i < otherHouses.length; i++) {
      console.log(otherHouses[i]);
      if (otherHouses[i].key == houseName) {
        setHouse(otherHouses[i]);
        setSaved(true);
        setOtherHouses(otherHouses.splice(i, 0));

        return;
      }
    }
  }

  function handleHouseSelection(e) {
    e.preventDefault();
    let targetHouse = e.target.parentElement.name;
    storeHouse(targetHouse);
  };

  return <>
    {(() => {
      console.log("fired new anon render func");
      if (loading) {
        return SVGSpinner;
      } else if (isError) {
        return <div>Something broke! {errorMsg} </div>;
      } else if (saved) {
        return storedHouse();
      } else {
        return newHouse();
      }
    })()}
  </>
}

export default HouseSelection;