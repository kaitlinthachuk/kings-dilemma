import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/VoteResult.scss';

function VoteResult(props) {
    const [moderator, setModerator] = useState("");
    const [tieBreaker, setTieBreaker] = useState(false);
    const [winner, setWinner] = useState("");
    const [modChoice, setModChoice] = useState("");

    useEffect(() => {
        database.ref('session/voting/moderator').once('value', (snapshot) => {
            setModerator(snapshot.val());
        });
        database.ref('session/voting/tie_breaker').on('value', (snapshot) => {
            setTieBreaker(snapshot.val());
        });

        database.ref('session/voting/winner').on('value', (snapshot) => {
            setWinner(snapshot.val());
        });
    }, [])


    function handleBreakTie(e) {
        e.preventDefault();
        database.ref('session/voting/tie_breaker').set(modChoice);
    }

    function handleBreakTieChange(e) {
        e.preventDefault();
        setModChoice(e.target.value);
    }
    let content, backgroundColor;

    if (winner === "aye" || winner === "nay") {
        backgroundColor = winner === "aye" ? "background-blue" : "background-red";
        content = <div className={`winner-container ${backgroundColor}`}>
            <h1 className="winner">{winner.toUpperCase()} Wins!</h1>
        </div >
    } else {
        if (tieBreaker) {
            if (props.house.key === moderator) {
                content = <div className="tie-break-container">
                    <label className="tie-break-input-label tie-break" htmlFor="aye">Aye</label>
                    <input
                        type="radio"
                        name="tie-breaker"
                        id="aye"
                        className="tie-break-input tie-break"
                        value="aye"
                        onChange={handleBreakTieChange}
                        checked={modChoice === "aye"}
                    />
                    <label className="tie-break-input-label tie-break" htmlFor="nay">Nay</label>
                    <input
                        type="radio"
                        name="tie-breaker"
                        id="nay"
                        className="tie-break-input tie-break"
                        value="nay"
                        onChange={handleBreakTieChange}
                        checked={modChoice === "nay"}
                    />
                    <input
                        type="button"
                        className="tie-break-button tie-break"
                        name="tie-breaker"
                        value="Break Tie!"
                        onClick={handleBreakTie}
                    />
                </div>
            }
            else {
                content = <div className="background-yellow tie-wait"><h2 >Moderator Needs to Break the Tie!</h2></div>
            }
        }
    }

    return (<div className="voting-result-container" >
        {content}
    </div>)
}


export default VoteResult;