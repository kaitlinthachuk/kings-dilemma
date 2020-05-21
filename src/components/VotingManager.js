import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/VotingManager.scss';

const images = require.context('../assets/', true);

function VotingManager(props) {
    const [ayeVotes, setAyeVotes] = useState([]);
    const [nayVotes, setNayVotes] = useState([]);
    const [ayeOutcomes, setAyeOutcomes] = useState([]);
    const [nayOutcomes, setNayOutcomes] = useState([]);

    const [vote, setVote] = useState({ vote: "", power: "" });

    useEffect(() => {
        database.ref('session/voting/aye/voters').on('value', (snapshot) => {
            setAyeVotes(Object.entries(snapshot.val()));
        });

        database.ref('session/voting/nay/voters').on('value', (snapshot) => {
            setNayVotes(Object.entries(snapshot.val()));
        });

        database.ref('session/voting/aye/outcomes').on('value', (snapshot) => {
            // setAyeOutcomes(Object.entries(snapshot.val()));
            setAyeOutcomes(initOutcomes(snapshot.val()));
        });

        database.ref('session/voting/nay/outcomes').on('value', (snapshot) => {
            // setNayOutcomes(Object.entries(snapshot.val()));
            setNayOutcomes(initOutcomes(snapshot.val()));
        })

    }, [])

    let content;
    if (props.isVisible) {
        content = <h3> start that voting</h3>
    }

    function initOutcomes(vals) {
        let outcomes = []
        for (const val in vals) {
            outcomes.push({
                key: val,
                token: vals[val],
                transform: `translate(${getRandom(50)}px, ${getRandom(50)}px) rotate(${getRandom(30)}deg)`,
            });
        }
        return outcomes;
    }

    function getRandom(scale) {
        return (Math.random() * 2 - 1) * scale;
    }

    return (
        <div className="voting-container" style={{ display: props.isVisible ? "" : "none" }}>
            <div className="aye-container" key="aye-container">
                <table className="aye" key="aye">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Aye
            </th>
                        </tr>
                        {ayeVotes.map((val) => {
                            return (<tr key={val[0]}>
                                <td>{val[0]}</td>
                                <td>{val[1]}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <div className="nay-container" key="nay-container">
                <table className="nay" key="nay">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Nay
            </th>
                        </tr>
                        {nayVotes.map((val) => {
                            return (<tr key={val[0]}>
                                <td>{val[0]}</td>
                                <td>{val[1]}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>

            <div className="aye-scale">
                <img src={images("./tokens/aye-scale.svg")} key="scales" />
                <div className="aye-token-container">
                    {ayeOutcomes.map((val) =>
                        <img
                            src={images('./tokens/outcome-' + val.token + ".svg")}
                            key={val.key}
                            className="aye-outcome-token token-small"
                            style={{ transform: val.transform }}
                        />
                    )}
                </div>
            </div>
            <div className="nay-scale">
                <img src={images("./tokens/nay-scale.svg")} key="scales" />
                <div className="nay-token-container">
                    {nayOutcomes.map((val) =>
                        <img
                            src={images('./tokens/outcome-' + val.token + ".svg")}
                            key={val.key}
                            className="nay-outcome-token token-small"
                            style={{ transform: val.transform }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default VotingManager;