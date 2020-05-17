import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/HouseSideMenu.scss';

const images = require.context('../assets', true);

function HouseSideMenu(props) {
    const [houses, setHouses] = useState(props.houses);

    let contents = [];
    houses.forEach(element => {
        let imgSrc = images("./images/" + element.key + "-small.png"),
            tokens = [],
            tokenSrc = "./tokens/";

        element.tokens.forEach(token => {
            tokens.push(<img className="token-tiny" src={images(tokenSrc + token + ".svg")} alt={token} />);
        })

        contents.push(
            <div className="menu-house">
                {tokens}
                <div className="house-container">
                    <img className="house token-medium" src={imgSrc} alt={element.key} />
                    <h4 className="house-name">{element.name}</h4>
                </div>
            </div>
        )
    });


    return (
        <div className="side-menu-container">
            {contents}
        </div>
    );

}

export default HouseSideMenu;