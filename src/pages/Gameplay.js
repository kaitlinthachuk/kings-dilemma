import React, { useEffect, useState, useContext } from 'react';
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
    const { myHouse,
        imageURL,
        gameState: { state,
            players,
            secretAgendas },
        actions: { selectSecretAgenda,
            setVoteOutcomes,
            setAgendaTokens,
            triggerEndGame }
    } = useContext(GameContext)
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toggle, setToggle] = useState(false);
    const [assignTokens, setAssignTokens] = useState(false);
    const [assignOutcomes, setAssignOutcomes] = useState(false);

    useEffect(() => {
        if (myHouse === "solad") {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
            setIsLoading(false)
        }
    }, [secretAgendas, players])

    function agendaOnClick(e) {
        e.preventDefault();
        selectSecretAgenda(myHouse, e.target.alt);
    }

    function tokenOnClick(e) {
        e.preventDefault();
        setAssignTokens(true);
    }

    function votingOnClick(e) {
        e.preventDefault();
        setAssignOutcomes(true);
    }

    function toggleOnClick(e) {
        e.preventDefault();
        setToggle(!toggle);
    }

    function processOutcomeTokens(e) {
        let ayeOutcomes = [],
            nayOutcomes = [];
        e.forEach((val) => {
            if (val.side === "aye") {
                ayeOutcomes.push({ 'type': val.alignment, "resource": val.token });
            } else {
                nayOutcomes.push({ 'type': val.alignment, "resource": val.token });
            }
        });
        setVoteOutcomes(ayeOutcomes, nayOutcomes);
        setAssignOutcomes(false);
    }

    function processTokens(e) {
        let tokenMap = {};
        e.forEach((val) => {
            if (tokenMap[val.house]) {
                tokenMap[val.house].push({ 'type': val.alignment, "resource": val.token });
            } else {
                tokenMap[val.house] = [{ 'type': val.alignment, "resource": val.token }];
            }
        });
        console.log(Object.entries(tokenMap));
        setAgendaTokens(Object.entries(tokenMap));
        setAssignTokens(false);
    }

    function endGame(e) {
        e.preventDefault();
        triggerEndGame();
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
                    !isLoading && !(state === "gameOver") && <VotingManager isVisible={toggle} house={players[myHouse]} />
                }
                {
                    !isLoading && (state === "gameOver") && <GameOver isVisible={toggle} houses={players} house={players[myHouse]} />
                }
                {
                    !isLoading && <Webcam isVisible={!toggle} />
                }
            </AspectRatioBox>
            {
                !isLoading && <button type="button" className="toggle-button" onClick={toggleOnClick} >Toggle View</button>
            }
            {
                !isLoading && <PlayerBar house={players[myHouse]} />
            }
            {
                !isLoading && <HouseSideMenu />
            }
        </div>
    );
}

export default Gameplay;
