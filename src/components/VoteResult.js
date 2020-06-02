import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/VoteResult.scss';

function VoteResult(props) {
    const [leader, setLeader] = useState("");
    const [moderator, setModerator] = useState("");
    const [tieBreaker, setTieBreaker] = useState(false);
    const [modChoice, setModChoice] = useState("");
    const [ayePower, setAyePower] = useState(0);
    const [nayPower, setNayPower] = useState(0);
    const [maxAye, setMaxAye] = useState({ power: 0, house: "" });
    const [maxNay, setMaxNay] = useState({ power: 0, house: "" });
    const [ayeVotes, setAyeVotes] = useState([]);
    const [nayVotes, setNayVotes] = useState([]);
    const [availablePower, setAvailablePower] = useState(0);
    const [processedWinners, setProcessedWinners] = useState(false);


    const keyChange = {
        "House Stormcloak": "solad",
        "House Rhinehardt": "tork",
        "House Arborstella": "tiryll",
        "House Irvine": "coden",
        "House Flora": "crann"
    }

    useEffect(() => {
        database.ref('session/voting/leader').on('value', (snapshot) => {
            setLeader(snapshot.val());
        });
        database.ref('session/voting/moderator').on('value', (snapshot) => {
            setModerator(snapshot.val());
        });
        database.ref('session/voting/tie_breaker').on('value', (snapshot) => {
            setTieBreaker(snapshot.val());
        });

        database.ref('session/voting/available_power').once('value', (snapshot) => {
            setAvailablePower(snapshot.val());
        });
        let tempPow = 0, tempVotes = [];

        props.ayeVotes.forEach(element => {
            tempPow += element[1];
            tempVotes.push([keyChange[element[0]], element[1]]);
            if (element[1] > maxAye["power"]) {
                setMaxAye({
                    power: element[1],
                    house: keyChange[element[0]]
                });
            }
        });
        setAyeVotes(tempVotes);
        setAyePower(tempPow);
        tempPow = 0;
        tempVotes = [];

        props.nayVotes.forEach(element => {
            tempPow += element[1];
            tempVotes.push([keyChange[element[0]], element[1]]);
            if (element[1] > maxNay["power"]) {
                setMaxNay({
                    power: element[1],
                    house: keyChange[element[0]]
                })
            }
        });
        setNayVotes(tempVotes);
        setNayPower(tempPow);

    }, [])


    function handleBreakTie(e) {
        e.preventDefault();
        database.ref('session/voting/tie_breaker').set(modChoice);
    }

    function handleBreakTieChange(e) {
        e.preventDefault();
        setModChoice(e.target.value);
    }

    function processWinner(winner, winnerPow) {
        let winners = winner === "aye" ? ayeVotes : nayVotes,
            winnersTotalPow = winner === "aye" ? ayePower : nayPower;
        //leader has to be on winning side
        if (winnerPow["house"] !== leader) {
            database.ref('session/voting/leader').set(winnerPow["house"]);
        }
        //take power from winners
        winners.forEach((pair) => {
            database.ref("session/" + pair[0] + "/power").once('value', (snapshot) => {
                database.ref("session/" + pair[0] + "/power").set(snapshot.val() - parseInt(pair[1]));
            });
        })

        //give power to those who gathered it, if any
        if (props.passVotes.length !== 0) {
            let gatheredPow = Math.floor(availablePower / props.passVotes.length);
            props.passVotes.forEach((house) => {
                database.ref("session/" + house + "/power").once('value', (snapshot) => {
                    database.ref("session/" + house + "/power").set(snapshot.val() + gatheredPow);
                });
            })

            //put winners power in center for next vote
            database.ref('session/voting/available_power').set(availablePower - gatheredPow * props.passVotes.length + winnersTotalPow);
        }
        setProcessedWinners(true);
    }

    let winner, winnerPow, content, backgroundColor, breakTie = false;

    if (tieBreaker === "aye" || tieBreaker === "nay") {
        winner = tieBreaker;
        winnerPow = tieBreaker === "aye" ? maxAye : maxNay;

        if (!processedWinners) {
            processWinner(tieBreaker, winnerPow);
        }
    }
    else if (ayePower === nayPower && ayePower !== 0) {
        breakTie = true;
        //tie needs to be broken by mod
    } else if (ayePower === nayPower) {
        //everyone passed, mod breaks tie and becomes leader
        breakTie = true;
        database.ref('session/voting/leader').set(moderator);
    } else {
        winner = ayePower > nayPower ? "aye" : "nay";
        winnerPow = winner === "aye" ? maxAye : maxNay;

        if (!processedWinners) {
            processWinner(winner, winnerPow);
        }
    }


    if (!breakTie) {
        backgroundColor = winner === "aye" ? "background-blue" : "background-red";
        content = <div className={`winner-container ${backgroundColor}`}>
            <h1 className="winner">{winner.toUpperCase()} Wins!</h1>
        </div >
    } else {
        if (!tieBreaker) {
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
                    />
                    <label className="tie-break-input-label tie-break" htmlFor="nay">Nay</label>
                    <input
                        type="radio"
                        name="tie-breaker"
                        id="nay"
                        className="tie-break-input tie-break"
                        value="nay"
                        onChange={handleBreakTieChange}
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