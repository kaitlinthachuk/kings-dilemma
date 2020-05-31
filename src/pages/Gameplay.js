import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../firebase.js';

import Navbar from '../components/Navbar.js';
import PlayerBar from '../components/PlayerBar.js';
import ImageModal from '../components/ImageModal.js';
import HouseSideMenu from '../components/HouseSideMenu.js';
import AgendaModal from '../components/AgendaModal.js';
import VotingManager from '../components/VotingManager.js';
import VotingOutcome from "../components/VotingOutcome.js";

import '../styles/Gameplay.scss';


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
    const [scale, setScale] = useState(1);
    const [votingOrder, setVotingOrder] = useState([]);
    const [votingDone, setVotingDone] = useState(false);

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
        })
    }, []);

    useLayoutEffect(() => {
        handleResize(); // for initial load if causes problems try useEffectLayout as suggested by react docs
        window.addEventListener('resize', handleResize);
        return (() => window.removeEventListener('resize', handleResize));
    });

    function handleResize() {
        const availableWidth = document.body.scrollWidth - 300; // 300 from sidebar width
        const availableHeight = document.body.scrollHeight - 60 - 180; // 60 nav and 180 playerbar
        const scale = Math.min(
            availableWidth / 1280,
            availableHeight / 720
        );
        setScale(scale);
    }

    let availableAgendas = [];

    if (!isLoading && secretAgenda.length === 0 && !selectAgenda.state) {
        database.ref("/session/" + house.key + "/secret_agenda").on('value', function (snapshot) {
            if (snapshot.val()) {
                database.ref("/session/available_agendas").once('value', function (snapshot) {
                    availableAgendas = snapshot.val();
                    availableAgendas.forEach(function (agenda, index) {
                        availableAgendas[index] = {
                            path: "cards/" + agenda + ".png",
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

    function startVoting(e) {
        e.preventDefault();
        if (votingDone) {
            database.ref('session/voting/aye/voters/').set({ placeholder: 5 });
            database.ref('session/voting/nay/voters/').set({ placeholder: 5 });
            database.ref('session/voting/pass/').set({ placeholder: 5 });
            database.ref('session/voting/aye/outcomes').remove();
            database.ref('session/voting/nay/outcomes').remove();
            database.ref('session/voting/').update({
                'voting_done': false,
                'tie_breaker': false,
                'become_mod': false
            });
            setIsVoting(false);

        } else if (!isVoting) {
            let j, x,
                temp = [...otherHouses];
            for (let i = 3; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = temp[i];
                temp[i] = temp[j];
                temp[j] = x;
            }
            let updateObj = {};

            for (let i = 0; i < 4; i++) {
                updateObj['/session/' + temp[i].key + "/next"] = temp[i + 1].key;
            }

            updateObj['/session/' + temp[4].key + "/next"] = temp[0].key;
            updateObj['/session/' + temp[4].key + "/voting_turn"] = true;
            updateObj['/session/' + temp[4].key + "/voting_turn"] = true;
            updateObj['/session/voting/moderator'] = otherHouses[0].key;
            updateObj['/session/voting/leader'] = otherHouses[4].key;

            let leader = temp.pop();
            temp.unshift(leader);

            database.ref().update(updateObj);
            setVotingOrder(temp);
            setAssignOutcomes(true);
        }
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

    return (

        <div className="gameplay-container">
            <Navbar isAdmin={isAdmin} tokenOnClick={tokenOnClick} votingOnClick={startVoting} />
            <ImageModal isVisible={selectAgenda.state} images={selectAgenda.availableAgendas}
                showClose='false' class="image-agenda-modal" />
            <AgendaModal isVisible={assignTokens} onSubmit={processTokens} />
            <VotingOutcome isVisible={assignOutcomes} onSubmit={processOutcomeTokens} />
            <div className='aspect-ratio-box-root'>
                {
                    !isLoading && <VotingManager isVisible={isVoting} scale={scale} house={house} />
                }
                {/* useful root for when adding webcame too */}
            </div>
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
