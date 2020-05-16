import React, { useState } from 'react';
import cardData from '../assets/cards/cards.json';

import '../styles/PlayerBar.scss';

const images = require.context('../assets', true);


function PlayerBar(props) {
    const [haveAgenda, setHaveAgenda] = useState(false);
    let coinSrc = images("./tokens/coin.svg"),
        powerSrc = images("./tokens/power.svg"),
        laurelSrc = images("./cards/laurel.svg"),
        boardSrc,
        resourceContents = [],
        rankingContents = [];


    if (props.secretAgenda.length > 0 && !haveAgenda) {
        setHaveAgenda(true);
    }

    if (haveAgenda) {
        let resources = cardData[props.secretAgenda]["resources"],
            ranking = cardData[props.secretAgenda]["ranking"];

        resources.forEach(element => {
            resourceContents.push(
                <tr key={element[0]}>
                    <td>{element[0]}</td>
                    <td>{element[1]}</td>
                </tr>
            );
        });
        ranking.forEach(element => {
            rankingContents.push(
                <tr key={element[0]}>
                    <td>{element[0]}</td>
                    <td>{element[1]}</td>
                </tr>
            );
        })

        boardSrc = images("./cards/" + props.secretAgenda + "-board.svg");
    }

    return (
        <>
            <div className="agenda-container">
                {haveAgenda &&
                    <table className="resources" key="resources">
                        <tbody>
                            <tr>
                                <th>Resources</th>
                                <th>
                                    <img src={laurelSrc} alt="laurel" />
                                </th>
                            </tr>
                            {resourceContents}
                        </tbody>
                    </table>
                }
                {haveAgenda &&
                    <table className="ranking" key="ranking">
                        <tbody>
                            <tr>
                                <th>
                                    <div className="header-wrapper">
                                        <img src={coinSrc} alt="coin" /> Ranking
                            </div>
                                </th>
                                <th>
                                    <img src={laurelSrc} alt="laurel" />
                                </th>
                            </tr>
                            {rankingContents}
                        </tbody>
                    </table>}
                {haveAgenda && <img src={boardSrc} key="board" className="playerbar-agenda" id="board" alt="agenda-board" />}
            </div>
            <div className="tokens-container">
                <div className="playerbar-value">
                    <img src={coinSrc} className="token-small playerbar-token" id="coin-svg" alt="coins" />
                    <span>{props.house.coins}</span>
                </div>
                <div className="playerbar-value">
                    <img src={powerSrc} className="token-small playerbar-token" id="power-svg" alt="power" />
                    <span>{props.house.power}</span>
                </div>
            </div>
        </>
    );
}

export default PlayerBar;