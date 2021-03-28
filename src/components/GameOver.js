import React, { useContext, useState } from 'react';
import GameContext from '../GameContext'

import '../styles/GameOver.scss';

function GameOver(props) {
    const {
        houseData,
        gameState: {
            players },
        actions: { updateCrave,
            updatePrestige }
    } = useContext(GameContext)

    const [crave, setCrave] = useState(0)
    const [prestige, setPrestige] = useState(0)

    function handleCraveUpdate(e) {
        e.preventDefault();
        setCrave(e.target.value);
    }

    function submitCrave(e) {
        e.preventDefault();
        updateCrave(parseInt(crave));
    }

    function handlePrestigeUpdate(e) {
        e.preventDefault();
        setPrestige(e.target.value);
    }

    function submitPrestige(e) {
        e.preventDefault();
        updatePrestige(parseInt(prestige));
    }

    return (<div className="end-game-container" style={{ display: props.isVisible ? "" : "none" }}>
        <div className="table-container" >
            <div className="power-container" key="power-container">
                <table className="power" key="power">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Power
                            </th>
                        </tr>
                        {players.sort((a, b) => {
                            return b.power - a.power
                        }).map((player) => {
                            return (<tr key={player.house}>
                                <td>{houseData[player.house].houseName}</td>
                                <td>{player.power}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <div className="coins-container" key="coins-container">
                <table className="coins" key="coins">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Coins
                            </th>
                        </tr>
                        {players.sort((a, b) => {
                            return b.coins - a.coins
                        }).map((player) => {
                            return (<tr key={player.house}>
                                <td>{houseData[player.house].houseName}</td>
                                <td>{player.power}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>

        </div>
        <div className="update-points">
            <h3>Update Your Crave and Prestige Points!</h3>
            <div className="update-prestige">
                <h4>Current Prestige Points: {prestige}</h4>
                <input
                    type="number"
                    className="update-prestige-input"
                    name="prestige-input"
                    placeholder="0"
                    onChange={handlePrestigeUpdate}
                />
                <input
                    type="button"
                    className="prestige-button"
                    name="prestige-update"
                    value="Update Prestige!"
                    onClick={submitPrestige}
                />
            </div>
            <div className="update-crave">
                <h4>Current Crave Points: {crave}</h4>
                <input
                    type="number"
                    className="update-crave-input"
                    name="crave-input"
                    placeholder="0"
                    onChange={handleCraveUpdate}
                />
                <input
                    type="button"
                    className="crave-button"
                    name="crave-update"
                    value="Update Crave!"
                    onClick={submitCrave}
                />
            </div>
        </div>

    </div>)
}

export default GameOver;