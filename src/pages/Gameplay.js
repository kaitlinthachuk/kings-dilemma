import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar.js';
import PlayerBar from '../components/PlayerBar.js';
import ImageModal from '../components/ImageModal.js';
import HouseSideMenu from '../components/HouseSideMenu.js';
import AgendaModal from '../components/AgendaModal.js';
import VotingManager from '../components/VotingManager.js';
import VotingOutcome from "../components/VotingOutcome.js";
import GameOver from "../components/GameOver.js";
import Webcam from "../components/Webcam.js";
import AspectRatioBox from '../components/AspectRatioBox';
import GameContext from '../GameContext'

import '../styles/Gameplay.scss';


function Gameplay(props) {
    const location = useLocation();
    const { state, secretAgendas, imageURL, emitSecretAgenda } = useContext(GameContext)
    const [house, setHouse] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [assignTokens, setAssignTokens] = useState(false);
    const [assignOutcomes, setAssignOutcomes] = useState(false);

    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        let { houseState } = location.state;
        setHouse(houseState);
        if (houseState.id === "solad") {
            setIsAdmin(true)
        }
        setIsLoading(false);
    }, []);

    function agendaOnClick(e) {
        e.preventDefault();
        emitSecretAgenda(house.id, e.target.alt)
    }

    function tokenOnClick(e) {
        e.preventDefault();
        setAssignTokens(true);
    }

    function votingOnClick(e) {
        e.preventDefault();
        if (votingDone) {
            otherHouses.forEach((house) => {
                database.ref("session/" + house.key + "/voting_turn").set(false);
            })
            database.ref('session/voting/aye/voters/').set({ placeholder: 5 });
            database.ref('session/voting/nay/voters/').set({ placeholder: 5 });
            database.ref('session/voting/pass/').set({ placeholder: 5 });
            database.ref('session/voting/aye/outcomes').remove();
            database.ref('session/voting/nay/outcomes').remove();
            database.ref('session/voting/voting_order').remove();
            database.ref('session/voting/').update({
                'voting_done': false,
                'tie_breaker': false,
                'become_mod': false,
                'start_voting': false,
                'winner': "val",
                'winner_update': false,
                "max_committed": 0,
                "leader_opt": "val",
                "leader_tie": false
            });
        } else if (!isVoting) {
            let updateObj = {}, temp;

            temp = shuffleHouses();
            for (let i = 0; i < 4; i++) {
                updateObj['/session/' + temp[i].key + "/next"] = temp[i + 1].key;
            }

            updateObj['/session/' + temp[4].key + "/next"] = temp[0].key;
            updateObj['/session/' + temp[0].key + "/voting_turn"] = true;
            updateObj['/session/voting/voting_order'] = temp;

            database.ref().update(updateObj);
            setAssignOutcomes(true);
        }
    }

    function toggleOnClick(e) {
        e.preventDefault();
        setToggle(!toggle);
    }

    function processOutcomeTokens(e) {
        e.forEach((val) => {
            database.ref('session/voting/' + val.side + "/outcomes").push(val.token + "-" + val.alignment);
        })
        database.ref().update({ '/session/voting/start_voting': true })
        setAssignOutcomes(false);
        setIsVoting(true);
    }

    function processTokens(e) {
        e.forEach((val) => {
            database.ref('session/tokens/' + val.house).push(val.token + "-" + val.alignment);
        })
        setAssignTokens(false);
    }

    function endGame(e) {
        e.preventDefault();
        database.ref('session/game_over').set(true);
        database.ref('session/voting/available_power').set(3);
        database.ref("session/tokens").remove();
    }

    return (

        <div className="gameplay-container">
            <Navbar isAdmin={isAdmin} tokenOnClick={tokenOnClick} votingOnClick={votingOnClick} endOnClick={endGame} />
            <ImageModal isVisible={state === "secretAgenda"} showClose='false' class="image-agenda-modal"
                images={secretAgendas.map((agenda) => {
                    return {
                        path: imageURL + "cards/" + agenda.name + ".png",
                        alt: agenda.name,
                        class: "image-modal-agenda",
                        onClick: agendaOnClick
                    }
                })} />
            <AgendaModal isVisible={assignTokens} onSubmit={processTokens} />
            <VotingOutcome isVisible={assignOutcomes} onSubmit={processOutcomeTokens} />
            <AspectRatioBox>
                {
                    !isLoading && !gameOver && <VotingManager isVisible={toggle} house={house} />
                }
                {
                    !isLoading && gameOver && <GameOver isVisible={toggle} houses={otherHouses} house={house} />
                }
                {
                    !isLoading && <Webcam isVisible={!toggle} />
                }
            </AspectRatioBox>
            {
                !isLoading && <button type="button" className="toggle-button" onClick={toggleOnClick} >Toggle View</button>
            }
            {
                !isLoading && <PlayerBar house={house} secretAgenda={secretAgenda} />
            }
            {
                !isLoading && <HouseSideMenu houses={otherHouses} order={votingOrder} />
            }
        </div>
    );
}

export default Gameplay;
