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
            setAyeOutcomes(Object.entries(snapshot.val()));
        });

        database.ref('session/voting/nay/outcomes').on('value', (snapshot) => {
            setNayOutcomes(Object.entries(snapshot.val()));
        })

    }, [])

    let content;
    if (props.isVisible) {
        content = <h3> start that voting</h3>
    }

    return (<div className="voting-container" style={{ display: props.isVisible ? "" : "none" }}>
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

        <div className="scale-container">
            <img src={images("./tokens/scales.svg")} key="scales" className="scales" />
            <div className="aye-token-container">
                {
                    ayeOutcomes.map((val) => {
                        return (<img src={images('./tokens/outcome-' + val[1] + ".svg")} key={val[1]} className="aye-outcome-token token-small" />)
                    })
                }
            </div>
            <div className="nay-token-container">
                {
                    nayOutcomes.map((val) => {
                        return (<img src={images('./tokens/outcome-' + val[1] + ".svg")} key={val[1]} className="nay-outcome-token token-small" />)
                    })
                }
            </div>
        </div>

    </div>);
}

export default VotingManager;