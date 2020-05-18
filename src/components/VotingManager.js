import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/VotingManager.scss';

const images = require.context('../assets/', true);

function VotingManager(props) {
    const [ayeVotes, setAyeVotes] = useState([]);
    const [nayVotes, setNayVotes] = useState([]);
    const [vote, setVote] = useState({ vote: "", power: "" });

    useEffect(() => {
        database.ref('session/voting/aye').on('value', (snapshot) => {
            setAyeVotes(Object.entries(snapshot.val()));
        });

        database.ref('session/voting/nay').on('value', (snapshot) => {
            setNayVotes(Object.entries(snapshot.val()));
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

        <img src={images("./tokens/scales.svg")} key="scales" className="scales" />
    </div>);
}

export default VotingManager;