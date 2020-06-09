import React, { useState, useEffect } from 'react';
import { database } from '../firebase.js';

import '../styles/GameOver.scss';

function GameOver(props) {
    const { houses, house } = props;
    const [power, setPower] = useState([]);
    const [coins, setCoins] = useState([]);
    const [crave, setCrave] = useState(0);
    const [prestige, setPrestige] = useState(0);
    const [updateCrave, setUpdateCrave] = useState(0);
    const [updatePrestige, setUpdatePrestige] = useState(0);

    useEffect(() => {
        let powerPromises = [], coinsPromises = [];
        houses.forEach(house => {
            powerPromises.push(
                new Promise((resolve, reject) => {
                    database.ref('session/' + house.key + '/power').on('value', (snapshot) => {
                        resolve([snapshot.val(), house.name]);
                    });
                })
            );

            coinsPromises.push(
                new Promise((resolve, reject) => {
                    database.ref('session/' + house.key + '/coins').on('value', (snapshot) => {
                        resolve([snapshot.val(), house.name]);
                    });
                })
            );
        });

        Promise.all(powerPromises).then(values => {
            let temp = [values[0]];
            for (let i = 1; i < values.length; i++) {
                for (let j = 0; j < temp.length; j++) {
                    if (temp[j][0] === values[i][0]) {
                        temp[j][1] += ", " + values[i][1];
                        break;
                    } else if (values[i][0] > temp[j][0]) {
                        temp.splice(j, 0, values[i]);
                        break;
                    } else if (j === temp.length - 1) {
                        temp.push(values[i]);
                        break;
                    }
                }
            }
            setPower(temp);
        });

        Promise.all(coinsPromises).then(values => {
            let temp = [values[0]];
            for (let i = 1; i < values.length; i++) {
                for (let j = 0; j < temp.length; j++) {
                    if (temp[j][0] === values[i][0]) {
                        temp[j][1] += ", " + values[i][1];
                        break;
                    } else if (values[i][0] > temp[j][0]) {
                        temp.splice(j, 0, values[i]);
                        break;
                    } else if (j === temp.length - 1) {
                        temp.push(values[i]);
                        break;
                    }
                }
            }
            setCoins(temp);
        })

        database.ref('houses/' + house.key + "/crave").on('value', (snapshot) => {
            setCrave(snapshot.val());
        });

        database.ref('houses/' + house.key + "/prestige").on('value', (snapshot) => {
            setPrestige(snapshot.val());
        });
    }, []);

    function handleCraveUpdate(e) {
        e.preventDefault();
        setUpdateCrave(e.target.value);
    }

    function submitCrave(e) {
        e.preventDefault();
        database.ref('houses/' + house.key + "/crave").set(updateCrave);
    }

    function handlePrestigeUpdate(e) {
        e.preventDefault();
        setUpdatePrestige(e.target.value);
    }

    function submitPrestige(e) {
        e.preventDefault();
        database.ref('houses/' + house.key + "/prestige").set(updatePrestige);
    }

    return (<div className="end-game-container">
        <div className="table-container">
            <div className="power-container" key="power-container">
                <table className="power" key="power">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Power
                            </th>
                        </tr>
                        {power.map((val) => {
                            return (<tr key={val}>
                                <td>{val[1]}</td>
                                <td>{val[0]}</td>
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
                        {coins.map((val) => {
                            return (<tr key={val}>
                                <td>{val[1]}</td>
                                <td>{val[0]}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>

        </div>
        <div className="update-points">
            <h3>Update Your Crave and Prestige Points!</h3>
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
                    onClick={submitCrave}
                />
            </div>
        </div>

    </div>)
}

export default GameOver;