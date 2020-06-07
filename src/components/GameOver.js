import React, { useState, useEffect } from 'react';
import { database } from '../firebase.js';

import '../styles/GameOver.scss';

function GameOver(props) {
    const { houses, house } = props;
    const [power, setPower] = useState([]);
    const [coins, setCoins] = useState([]);

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
    }, []);

    return (<div className="end-game-container">
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
    </div>)
}

export default GameOver;