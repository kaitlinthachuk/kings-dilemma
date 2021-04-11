import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar.js';
import PlayerBar from '../components/PlayerBar.js';
import ImageModal from '../components/ImageModal.js';
import HouseSideMenu from '../components/HouseSideMenu.js';
import VotingManager from '../components/VotingManager.js';
import GameOver from "../components/GameOver.js";
import Webcam from "../components/Webcam.js";
import AspectRatioBox from '../components/AspectRatioBox';
import GameContext from '../GameContext'

import '../styles/Gameplay.scss';


function Gameplay(props) {
    const { myHouse,
        imageURL,
        gameState: { state,
            turn,
            secretAgendas },
        actions: { selectSecretAgenda, }
    } = useContext(GameContext)

    const [toggle, setToggle] = useState(false);

    function agendaOnClick(agendaName) {
        selectSecretAgenda(agendaName);
    }

    function toggleOnClick(e) {
        e.preventDefault();
        setToggle(!toggle);
    }

    return (
        <div className="gameplay-container">
            <Navbar />
            <ImageModal isVisible={state === "secretAgenda" && turn === myHouse} showClose='false' class="image-agenda-modal"
                images={secretAgendas.map((agenda) => {
                    return {
                        path: imageURL + "cards/" + agenda.name + ".png",
                        alt: agenda.name,
                        class: "image-modal-agenda",
                        onClick: () => agendaOnClick(agenda.name)
                    }
                })} />
            <AspectRatioBox>
                {
                    !(state === "gameOver") && <VotingManager isVisible={toggle} />
                }
                {
                    (state === "gameOver") && <GameOver isVisible={toggle} />
                }
                {
                    <Webcam isVisible={!toggle} />
                }
            </AspectRatioBox>
            {
                <button type="button" className="toggle-button" onClick={toggleOnClick} >Toggle View</button>
            }
            < PlayerBar />
            < HouseSideMenu />
        </div>
    );
}

export default Gameplay;
