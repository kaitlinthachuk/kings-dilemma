import React, { useContext } from 'react';
import House from './House.js';
import GameContext from '../GameContext'

import '../styles/HouseSideMenu.scss';

function HouseSideMenu() {
    const {
        gameState: {
            players,
            turnOrder },
    } = useContext(GameContext)

    return (
        <div className="side-menu-container" key="main">
            {turnOrder.map(house => {
                return <House player={players[house]} key={players[house].house} />
            })
            }
        </div>
    )

}

export default HouseSideMenu;