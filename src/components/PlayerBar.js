import React, { useContext, useState } from 'react';
import GameContext from '../GameContext'
import SecretAgendaDisplay from './SecretAgendaDisplay'
import MessageBoard from './MessageBoard'

import "../styles/PlayerBar.scss"

function PlayerBar() {
    const { myHouse,
        imageURL,
        gameState: { players }
    } = useContext(GameContext)

    const [isVisible, setIsVisible] = useState(true)

    let coinSrc = imageURL + "tokens/coin.svg",
        powerSrc = imageURL + "tokens/power.svg";

    function setVisibility(bool) {
        console.log("called func with" + bool);
        setIsVisible(bool);
    }


    return (
        <>
            <div className='tab-container'>
                <div className="tab-buttons-container">
                    <button class="tab-button" onclick={() => setVisibility(true)}>Secret Agenda</button>
                    <button class="tab-button" onclick={() => setVisibility(false)}>Message Board</button>
                </div>
                {
                    players[myHouse] && players[myHouse].secretAgenda && isVisible && <SecretAgendaDisplay />
                }
                {
                    !isVisible && <MessageBoard />
                }
            </div>
            <div className="tokens-container">
                <div className="playerbar-value">
                    <img src={coinSrc} className="token-small playerbar-token" id="coin-svg" alt="coins" />
                    <span>{players[myHouse].coins}</span>
                </div>
                <div className="playerbar-value">
                    <img src={powerSrc} className="token-small playerbar-token" id="power-svg" alt="power" />
                    <span>{players[myHouse].power}</span>
                </div>
            </div>
        </>
    );
}

export default PlayerBar;