import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { storage, constants} from '../utils.js';

import '../styles/HouseSelection.css';

const API_BASE_URL = //TODO set up server;


class HouseSelection extends Component {
    constructor(props){
        this.state = {
            isError   : false,
            error     : null,
            houses: [],
            house  : {},
            remainingHouses: [],
            saved     : false,
            loading   : true,
          };


    }
  componentDidMount() {
    //fetch house files from server
    this.setState({
        loading: true,
        isError: false
      })
      fetch(API_BASE_URL)
        .then((res) => { return res.json()})
        .then((houses) => {
          houses = houses.map((house) => {
            return {
              name: house["name"],
              kingdom: house["kingdom"],
              motto: house['motto'],
              crave: house['crave'],
              prestige: house['prestige'],
              pres_num: house['prestige_number'],
              image_URL: house['image']
            };
          });
          this.setState({
            houses: houses,
            loading: false,
          });
        },
        (error) =>{
          this.setState({
            isError: true,
            error: error
          });
        })
  }

  render() {
    const { houses, isError, loading } = this.state;

    let contents;
    if (isError) {
      contents = <div>Something broke!
                    <div><button className= "reload-monsters" onClick = {() => this.fetchMonsters()}> Reload Monsters </button> </div>
                  </div>;
    } else if (loading) {
      contents = SVGSpinner;
    } else {
      contents = this.buildMonsterList();
    }

  }
}

const SVGSpinner =
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g>
      <circle className={'spinner'} cx={50} cy={50} r={25} />
      <circle className={'spinner-inner'} cx={50} cy={50} r={15} />
      {/* <path d='M 50 50 a 25 25 0 0 1 5 50' stroke='blue' stroke-width={2}/> */}
      </g>
    </svg>;

export default HouseSelection;





