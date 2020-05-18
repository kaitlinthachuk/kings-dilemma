import React, { useState, useEffect } from 'react';
import cardData from '../assets/cards/cards.json';
import { database } from '../firebase.js';

import '../styles/PlayerBar.scss';

const images = require.context('../assets', true);


function PlayerBar(props) {
    const [haveAgenda, setHaveAgenda] = useState(false);
    const [coins, setCoins] = useState(0);
    const [power, setPower] = useState(0);

    let coinSrc = images("./tokens/coin.svg"),
        powerSrc = images("./tokens/power.svg"),
        laurelSrc = images("./cards/laurel.svg"),
        boardSrc,
        isExtremist = false,
        isRebel = false,
        resourceContents = [],
        rankingContents = [];


    useEffect(() => {
        database.ref('session/' + props.house.key + "/coins").on('value', (snapshot) => {
            setCoins(snapshot.val());
        });

        database.ref('session/' + props.house.key + "/power").on('value', (snapshot) => {
            setPower(snapshot.val());
        });

    }, [])


    if (props.secretAgenda.length > 0 && !haveAgenda) {
        setHaveAgenda(true);
    }

    if (haveAgenda) {
        let resources = cardData[props.secretAgenda]["resources"],
            ranking = cardData[props.secretAgenda]["ranking"];

        if (props.secretAgenda === "rebel") {
            isRebel = true;
        }

        if (props.secretAgenda === "extremist") {
            resourceContents.push(<div className="extremist-resources">{resources}</div>);
            isExtremist = true;
        } else {
            resources.forEach(element => {
                resourceContents.push(
                    <tr key={element[0]}>
                        <td>{element[0]}</td>
                        <td>{element[1]}</td>
                    </tr>
                );
            });
        }

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
                {haveAgenda && !isExtremist &&
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
                {isExtremist && resourceContents}
                {isRebel && <span className="rebel-extra">{cardData[props.secretAgenda]["extra"]}</span>}
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
                    <span>{coins}</span>
                </div>
                <div className="playerbar-value">
                    <img src={powerSrc} className="token-small playerbar-token" id="power-svg" alt="power" />
                    <span>{power}</span>
                </div>
            </div>
        </>
    );
}

export default PlayerBar;