import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../firebase.js';

import Navbar from '../components/Navbar.js';
import PlayerBar from '../components/PlayerBar.js';
import ImageModal from '../components/ImageModal.js';
import HouseSideMenu from '../components/HouseSideMenu.js';
import AgendaModal from '../components/AgendaModal.js';
import VotingManager from '../components/VotingManager.js'

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
                ['session/tokens/' + otherHousesState[0].key]: ["moderator"],
                ['session/tokens/' + otherHousesState[4].key]: ["leader"]
            });
            setIsAdmin(true);
        }

        setHouse(houseState);
        setOtherHouses(otherHousesState);
        setIsLoading(false);

        database.ref('/session/voting/start_voting').on('value', function (snapshot) {
            if (snapshot.val()) {
                setIsVoting(true);
            } else {
                setIsVoting(false);
            }
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
        database.ref().update({ '/session/voting/start_voting': true })
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
            <VotingManager isVisible={isVoting} />
            {
                !isLoading && <PlayerBar house={house} secretAgenda={secretAgenda} />
            }
            {
                !isLoading && <HouseSideMenu houses={otherHouses} />
            }
        </div>
    );
}

export default Gameplay;
