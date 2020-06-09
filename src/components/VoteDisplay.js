import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';

import '../styles/VoteDisplay.scss';


function VoteDisplay(props) {
    const [turn, setTurn] = useState(false);
    const [vote, setVote] = useState({ vote: "", color: "" });
    const [power, setPower] = useState(0);
    const [next, setNext] = useState("");
    const [leader, setLeader] = useState("");
    const [passMod, setPassMod] = useState(false);
    const [addPower, setAddPower] = useState(1);
    const [availablePower, setAvailablePower] = useState(0);
    const [coins, setCoins] = useState(0);
    const [maxComitted, setMaxComitted] = useState(0);


    useEffect(() => {
        database.ref('session/' + props.house.key + "/voting_turn").on('value', (snapshot) => {
            setTurn(snapshot.val());
        });
        database.ref('session/' + props.house.key + "/next").on('value', (snapshot) => {
            setNext(snapshot.val());
        });
        database.ref('session/voting/leader').on('value', (snapshot) => {
            setLeader(snapshot.val());
        });
        database.ref('session/voting/become_mod').on('value', (snapshot) => {
            setPassMod(snapshot.val());
        });

        database.ref('session/' + props.house.key + '/power').on('value', (snapshot) => {
            setAvailablePower(snapshot.val());
        });

        database.ref('session/' + props.house.key + '/coins').on('value', (snapshot) => {
            setCoins(snapshot.val());
        });
        database.ref('session/voting/max_comitted').on('value', (snapshot) => {
            setMaxComitted(snapshot.val());
        });
    }, [])

    function voteClick(e) {
        e.preventDefault();

        let color = "background-yellow";

        if (e.target.value.toLowerCase() === "aye") {
            color = "background-blue";
        } else if (e.target.value.toLowerCase() === "nay") {
            color = "background-red";
        }

        if (e.target.value.includes("Pass")) {
            database.ref('session/').update({
                [next + '/voting_turn']: true,
                [props.house.key + "/voting_turn"]: false,
                [props.house.key + "/coins"]: coins + 1
            });

            if (e.target.value.includes("Moderator")) {
                database.ref("session/voting/moderator").set(props.house.key);
                database.ref("session/voting/become_mod").set(true);
            }

            if (e.target.value.includes("Power")) {
                database.ref("session/voting/pass").update({
                    [props.house.key]: "gather"
                })
            }

            setTurn(false);
        }

        setVote({
            vote: e.target.value.toLowerCase(),
            color: color
        })
    }

    function commitPower(e) {
        e.preventDefault();
        let pow;
        if (parseInt(addPower) + power > availablePower) {
            pow = availablePower;
        } else {
            pow = parseInt(addPower) + power
        }

        database.ref('session/').update({
            ['voting/' + vote["vote"] + '/voters/' + props.house.name]: pow,
            [next + '/voting_turn']: true,
            [props.house.key + "/voting_turn"]: false
        });

        if (pow > maxComitted) {
            database.ref("session/voting/leader").set(props.house.key).then(() => {
                return database.ref('session/voting/max_comitted').set(pow);
            }).then(() => {
                setTurn(false);
            })
        } else if (next === leader) {
            database.ref('session/voting/voting_done').set(true).then(() => {
                setTurn(false);
            });
        }

        setPower(pow);
        setAddPower(1);
    }

    function handleChange(e) {
        e.preventDefault();
        setAddPower(e.target.value);
    }


    if (turn && vote["vote"].includes("pass")) {
        database.ref('session/').update({
            [next + '/voting_turn']: true,
            [props.house.key + "/voting_turn"]: false,
        });

        if (next === leader) {
            database.ref('session/voting/voting_done').set(true);
        }
        setTurn(false);
    }

    let content;

    if (!turn && vote["vote"].length === 0) {
        content = <h1>Waiting For Your Turn....</h1>
    } else if (turn && vote["vote"].length === 0) {
        content = <div className="select-vote">
            <input
                type="button"
                className="nay-button"
                name="vote"
                value="Nay"
                onClick={voteClick}
            />
            {
                !passMod && <input
                    type="button"
                    className="pass-button"
                    name="vote"
                    value="Pass & Become Moderator"
                    onClick={voteClick}
                />
            }
            <input
                type="button"
                className="pass-button"
                name="vote"
                value="Pass & Gather Power"
                onClick={voteClick}
            />
            <input
                type="button"
                className="aye-button"
                name="vote"
                value="Aye"
                onClick={voteClick}
            />
        </div>
    } else {
        content = <div className={`add-power-container ${vote["color"]}`}>
            <h1 className="add-power add-power-header">{vote["vote"]}</h1>
            {
                !vote["vote"].includes("pass") && <> <h2 className="add-power add-power-header">Current Power Comitted: {power}</h2>

                    {
                        turn && <input
                            type="number"
                            className="add-power-input add-power"
                            name="add-power"
                            placeholder="1"
                            onChange={handleChange}
                        />
                    }
                    {
                        turn && <input
                            type="button"
                            className="add-power-button add-power"
                            name="add-power-button"
                            value="Vote!"
                            onClick={commitPower}
                        />
                    }
                </>
            }
        </div >
    }

    return (<div className="voting-display-container" >
        {content}
    </div>)
}


export default VoteDisplay;