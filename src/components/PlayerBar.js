import React, { useContext } from 'react';
import GameContext from '../GameContext'

import '../styles/PlayerBar.scss';

function PlayerBar() {
    const { myHouse,
        imageURL,
        gameState: { players }
    } = useContext(GameContext)

    let coinSrc = imageURL + "tokens/coin.svg",
        powerSrc = imageURL + "tokens/power.svg",
        laurelSrc = imageURL + "cards/laurel.svg",
        boardSrc,
        resources, ranking,
        isExtremist = false,
        isRebel = false,
        player = players[myHouse],
        secretAgenda = player.secretAgenda;


    if (secretAgenda) {
        resources = secretAgenda.resourceGoalScoring.map(resource => {
            return <tr key={resource.numResources + resource.points}>
                <td>{resource.numResources}</td>
                <td>{resource.points}</td>
            </tr>
        })

        ranking = secretAgenda.moneyGoalScoring.map(resource => {
            return <tr key={resource.rank + resource.points}>
                <td>{resource.rank}</td>
                <td>{resource.points}</td>
            </tr>
        })

        if (secretAgenda.name === "rebel") {
            isRebel = true;
        }

        if (secretAgenda.name === "extremist") {
            resources.push(<div className="extremist-resources">{resources}</div>);
            isExtremist = true;
        }


        boardSrc = imageURL + "cards/" + secretAgenda.name + "-board.svg";
    }

    return (
        <>
            <div className="agenda-container">
                <div className="agenda-tables">
                    {secretAgenda && <h3> {secretAgenda.name.toUpperCase()}</h3>}
                    {secretAgenda && !isExtremist &&
                        <table className="resources" key="resources">
                            <tbody>
                                <tr>
                                    <th>Resources</th>
                                    <th>
                                        <img src={laurelSrc} alt="laurel" />
                                    </th>
                                </tr>
                                {resources}
                            </tbody>
                        </table>
                    }
                    {isExtremist && resources}
                    {isRebel && <span className="rebel-extra">{secretAgenda.extra}</span>}
                    {secretAgenda &&
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
                                {ranking}
                            </tbody>
                        </table>}
                </div>
                {secretAgenda && <img src={boardSrc} key="board" className="playerbar-agenda" id="board" alt="agenda-board" />}

            </div>
            <div className="tokens-container">
                <div className="playerbar-value">
                    <img src={coinSrc} className="token-small playerbar-token" id="coin-svg" alt="coins" />
                    <span>{player.coins}</span>
                </div>
                <div className="playerbar-value">
                    <img src={powerSrc} className="token-small playerbar-token" id="power-svg" alt="power" />
                    <span>{player.power}</span>
                </div>
            </div>
        </>
    );
}

export default PlayerBar;