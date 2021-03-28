import React, { useEffect, useState, useContext } from 'react';
import GameContext from '../GameContext'

import '../styles/VoteDisplay.scss';


function VoteDisplay(props) {
    const { myHouse,
        houseData,
        gameState: { votes,
            availablePower,
            turn,
            players,
            becomeModAvailable },
        actions: {
            playerVote
        }
    } = useContext(GameContext)

    const [intermediateVote, setIntermediateVote] = useState({})
    const [addedPower, setAddedPower] = useState(0)

    function voteClick(e) {
        e.preventDefault();

        let color = "background-yellow";

        if (e.target.value.toLowerCase() === "aye") {
            color = "background-blue";
        } else if (e.target.value.toLowerCase() === "nay") {
            color = "background-red";
        }

        if (e.target.value.includes("Pass")) {
            if (e.target.value.includes("Moderator")) {
                playerVote({ house: myHouse, type: 'mod', power: 0 })
            }

            if (e.target.value.includes("Power")) {
                playerVote({ house: myHouse, type: 'gather', power: 0 })
            }
        }

        setIntermediateVote({
            vote: e.target.value.toLowerCase(),
            color: color
        })
    }

    function commitPower(e) {
        e.preventDefault();
        playerVote({ house: myHouse, type: intermediateVote.vote, power: addedPower })
    }

    function handleChange(e) {
        e.preventDefault();
        setAddedPower(parseInt(e.target.value));
    }

    let content;

    if (!turn && !votes[players.house]) {
        content = <h1>Waiting For Your Turn....</h1>
    } else if (turn && !votes[players.house]) {
        content = <div className="select-vote">
            <input
                type="button"
                className="nay-button"
                name="vote"
                value="Nay"
                onClick={voteClick}
            />
            {
                becomeModAvailable && <input
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
        content = <div className={`add-power-container ${intermediateVote["color"]}`}>
            <h1 className="add-power add-power-header">{intermediateVote["vote"]}</h1>
            {
                (votes[myHouse].type === 'aye' || votes[myHouse].type === 'nay')
                && <> <h2 className="add-power add-power-header">Current Power Comitted: {votes[myHouse].power}</h2>

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