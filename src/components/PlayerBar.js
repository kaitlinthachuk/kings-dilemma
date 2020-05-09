import React from 'react';

import '../styles/PlayerBar.scss';

const images = require.context('../assets', true);

function PlayerBar(props) {
    let coinSrc = images("./tokens/coin.svg"),
        powerSrc = images("./tokens/power.svg");
    //agendaSrc = images("./" + props.house.agenda);
    //rankingSrc = images("./cards/greedy-ranking.png");
    //resSrc = images("./cards/greedy-resources.png"),
    //boardSrc = images("./cards/greedy-board.png");

    return (
        <div className='playerbar-container'>
            <div className="playerbar-value">
                <img src={coinSrc} className="token-small playerbar-token" id="coin-svg" alt="coins" />
                <span>{props.house.coins}</span>
            </div>
            <div className="playerbar-value">
                <img src={powerSrc} className="token-small playerbar-token" id="power-svg" alt="power" />
                <span>{props.house.power}</span>
            </div>
            <div className="playerbar-value">
                {//<img src={rankingSrc} className="playerbar-agenda" id="ranking" alt="agenda-ranking" />
                    //<img src={resSrc} className="playerbar-agenda" id="res" alt="agenda-resources" />
                    //<img src={boardSrc} className="playerbar-agenda" id="board" alt="agenda-board" />
                }
            </div>
        </div>
    );
}

export default PlayerBar;