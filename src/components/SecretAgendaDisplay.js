import React, { useContext } from 'react';
import GameContext from '../GameContext';

import '../styles/SecretAgendaDisplay.scss';

function SecretAgendaDisplay() {
    const { myHouse,
        imageURL,
        gameState: { players }
    } = useContext(GameContext)

    let player = players[myHouse],
        secretAgenda = player.secretAgenda,
        coinSrc = imageURL + "tokens/coin.svg",
        laurelSrc = imageURL + "cards/laurel.svg",
        boardSrc = imageURL + "cards/" + secretAgenda.name + "-board.svg",
        isExtremist = false,
        isRebel = false;



    let resources = secretAgenda.resourceGoalScoring.map(resource => {
        return <tr key={resource.numResources + resource.points}>
            <td>{resource.numResources}</td>
            <td>{resource.points}</td>
        </tr>
    })

    let ranking = secretAgenda.moneyGoalScoring.map(resource => {
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

    return (
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
    );
}

export default SecretAgendaDisplay;