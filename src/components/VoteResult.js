import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/VoteResult.scss';

function VoteResult(props) {
    const [moderator, setModerator] = useState("");
    const [tieBreaker, setTieBreaker] = useState(false);
    const [winner, setWinner] = useState("");
    const [modChoice, setModChoice] = useState("");
    const [leaderTie, setLeaderTie] = useState(false);
    const [leaderOpt, setLeaderOpt] = useState([]);
    const [modLeaderChoice, setModLeaderChoice] = useState("");

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
        database.ref('session/voting/leader_tie').on('value', (snapshot) => {
            setLeaderTie(snapshot.val());
        });
        database.ref('session/voting/leader_opt').on('value', (snapshot) => {
            if (snapshot.val() !== "val") {
                setLeaderOpt(snapshot.val());
            }

        })
    }, [])


    function handleBreakTie(e) {
        e.preventDefault();
        database.ref('session/voting/tie_breaker').set(modChoice);
        setTieBreaker(false);
    }

    function handleBreakTieChange(e) {
        e.preventDefault();
        setModChoice(e.target.value);
    }

    function handleBreakLeaderTieChange(e) {
        e.preventDefault();
        setModLeaderChoice(e.target.value);
    }

    function handleLeaderBreakTie(e) {
        e.preventDefault();
        database.ref('session/voting/leader').set(modLeaderChoice).then(() => {
            database.ref('session/voting/leader_tie').set(false);
        });
    }
    let content = [], backgroundColor;

    if ((winner === "aye" || winner === "nay") && !leaderTie) {
        backgroundColor = winner === "aye" ? "background-blue" : "background-red";
        content = <div className={`winner-container ${backgroundColor}`}>
            <h1 className="winner">{winner.toUpperCase()} Wins!</h1>
        </div >
    } else {
        if (tieBreaker) {
            if (props.house.key === moderator) {
                content.push(<div className="tie-break-container">
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
                </div>)
            }
            else {
                content.push(<div className="background-yellow tie-wait"><h2 >Moderator Needs to Break the Tie!</h2></div>);
            }
        } else if (leaderTie) {
            if (props.house.key === moderator) {
                content.push(
                    <div className="tie-leader-container">
                        {
                            leaderOpt.map(element => {
                                return <>
                                    <label className="tie-leader-input-label tie-leader" htmlFor={element[0]}>{element[1]}</label>
                                    <input
                                        type="radio"
                                        name="tie-leader"
                                        className="tie-leader-input tie-leader"
                                        value={element[0]}
                                        onChange={handleBreakLeaderTieChange}
                                        checked={modLeaderChoice === element[0]}
                                    />
                                </>
                            })
                        }

                        <input
                            type="button"
                            className="tie-leader-button tie-break"
                            name="tie-breaker-leader"
                            value="Choose Leader"
                            onClick={handleLeaderBreakTie}
                        />
                    </div>)

            } else {
                content.push(<div className="background-yellow tie-wait"><h2> Moderator Needs to Choose a Leader! </h2></div>)
            }
        }
    }

    return (<div className="voting-result-container" >
        {content}
    </div>)
}


export default VoteResult;