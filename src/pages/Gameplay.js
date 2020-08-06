import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../firebase.js';

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

import '../styles/Gameplay.scss';

const baseURL = 'https://res.cloudinary.com/didsjgttu/image/upload/';

function Gameplay(props) {
    const location = useLocation();
    const [isVoting, setIsVoting] = useState(false);
    const [house, setHouse] = useState(null);
    const [otherHouses, setOtherHouses] = useState([]);
    const [secretAgenda, setSecretAgenda] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectAgenda, setSelectAgenda] = useState({ state: false, availableAgendas: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [assignTokens, setAssignTokens] = useState(false);
    const [assignOutcomes, setAssignOutcomes] = useState(false);
    const [votingOrder, setVotingOrder] = useState([]);
    const [votingDone, setVotingDone] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [leader, setLeader] = useState("");
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        let { houseState, otherHousesState } = location.state;

        otherHousesState.sort((a, b) => {
            if (a.prestige === b.prestige) {
                return a.number - b.number;
            } else {
                return a.prestige - b.prestige;
            }

        })

        let randomIndex = Math.floor(Math.random() * 4),
            availableAgendas = ['greedy', 'opulent', 'rebel', 'opportunist', 'moderate', 'extremist'];

        availableAgendas.splice(randomIndex, 1);

        if (houseState.key === "solad") {
            database.ref().update({
                'session/available_agendas': availableAgendas,
                ['session/' + otherHousesState[0].key + "/secret_agenda"]: true,
                'session/voting/moderator': otherHousesState[0].key,
                'session/voting/leader': otherHousesState[4].key
            });
            setIsAdmin(true);
        }

        setHouse(houseState);
        setOtherHouses(otherHousesState);
        setIsLoading(false);

        database.ref('/session/voting/start_voting').on('value', function (snapshot) {
            setIsVoting(snapshot.val());
        });

        database.ref('/session/voting/voting_done').on('value', function (snapshot) {
            setVotingDone(snapshot.val());
        });

        database.ref('/session/voting/voting_order').on('value', function (snapshot) {
            setVotingOrder(snapshot.val());
        })

        database.ref('/session/game_over').on('value', function (snapshot) {
            setGameOver(snapshot.val());
        })

        database.ref('/session/voting/leader').on('value', function (snapshot) {
            setLeader(snapshot.val());
        })
    }, []);

    let availableAgendas = [];

    if (!isLoading && secretAgenda.length === 0 && !selectAgenda.state) {
        database.ref("/session/" + house.key + "/secret_agenda").on('value', function (snapshot) {
            if (snapshot.val()) {
                database.ref("/session/available_agendas").once('value', function (snapshot) {
                    availableAgendas = snapshot.val();
                    availableAgendas.forEach(function (agenda, index) {
                        availableAgendas[index] = {
                            path: baseURL + "cards/" + agenda + ".png",
                            alt: agenda,
                            class: "image-modal-agenda",
                            onClick: agendaOnClick
                        };
                    });
                    setSelectAgenda({ state: true, availableAgendas: availableAgendas });
                })
            }
        });

    }

    function agendaOnClick(e) {
        e.preventDefault();
        let index = otherHouses.findIndex(function (el) {
            return house.key === el.key;
        });


        let agendaIndex = availableAgendas.findIndex(function (el) {
            return el.alt === e.target.alt;
        });

        availableAgendas.splice(agendaIndex, 1);

        availableAgendas = availableAgendas.map(function (el) {
            return el.alt;
        })

        let housePath = 'session/' + [house.key] + "/secret_agenda";


        if (index < 4) {
            let nextPath = 'session/' + otherHouses[index + 1].key + "/secret_agenda";
            database.ref().update({
                [nextPath]: true
            })
        }

        database.ref().update({
            'session/available_agendas': availableAgendas,
            [housePath]: false
        });

        setSecretAgenda(e.target.alt);
        setSelectAgenda(false);
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

    function shuffleHouses() {
        let temp = [...otherHouses],
            tempLeader;
        for (let i = 0; i <= 4; i++) {
            if (temp[i].key === leader) {
                tempLeader = temp[i];
                temp.splice(i, 1);
                break;
            }
        }

        let j, x;
        for (let i = 3; i >= 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = temp[i];
            temp[i] = temp[j];
            temp[j] = x;
        }

        temp.unshift(tempLeader);

        return temp;
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
            <ImageModal isVisible={selectAgenda.state && secretAgenda.length === 0} images={selectAgenda.availableAgendas}
                showClose='false' class="image-agenda-modal" />
            <AgendaModal isVisible={assignTokens} onSubmit={processTokens} />
            <VotingOutcome isVisible={assignOutcomes} onSubmit={processOutcomeTokens} />
            <AspectRatioBox>
                {
                    !isLoading && !gameOver && <VotingManager isVisible={toggle} house={house} />
                }
                {
                    !isLoading && gameOver && <GameOver houses={otherHouses} house={house} />
                }
                {
                    !isLoading && !gameOver && <Webcam isVisible={!toggle} />
                }
                {
                    !isLoading && <button type="button" className="toggle-button" onClick={toggleOnClick} >Toggle View</button>
                }
            </AspectRatioBox>
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
