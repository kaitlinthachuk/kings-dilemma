import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../firebase.js';

import Navbar from '../components/Navbar.js';
import PlayerBar from '../components/PlayerBar.js';
import ImageModal from '../components/ImageModal.js';
//import HouseSideMenu from '../components/HouseSideMenu.jsx';

import '../styles/Gameplay.scss';


function Gameplay(props) {
    const location = useLocation();
    const [isVoting, setIsVoting] = useState(false);
    const [house, setHouse] = useState(null);
    const [otherHouses, setOtherHouses] = useState([]);
    const [secretAgenda, setSecretAgenda] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectAgenda, setSelectAgenda] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let { houseState, otherHousesState } = location.state;

        otherHousesState.sort((a, b) => {
            if (a.prestige === b.prestige) {
                return a.number - b.number;
            } else {
                return a.prestige - b.prestige;
            }

        })
        otherHousesState[0].tokens.push('mod');
        otherHousesState[4].tokens.push('leader');
        let randomIndex = Math.floor(Math.random() * 4),
            availableAgendas = ['greedy', 'opulent', 'rebel', 'opportunist', 'moderate', 'extremist'];

        availableAgendas.splice(randomIndex, 1);

        database.ref('session/').set({
            available_agendas: availableAgendas
        });
        database.ref('session/' + otherHousesState[0].key).set({
            secret_agenda: true
        });

        if (houseState.key === "solad") {
            database.ref('session/tokens/').set({
                [otherHousesState[0].key]: "mod",
                [otherHousesState[4].key]: "leader"
            });
            setIsAdmin(true);
        }

        if (houseState.key === otherHousesState[0].key) {
            setSelectAgenda(true);
        }
        setHouse(houseState);
        setOtherHouses(otherHousesState);
        setIsLoading(false);
    }, []);

    let availableAgendas = [],
        initiateSelect = false;
    if (!isLoading && !availableAgendas) {
        database.ref("/session/" + house.key + "/secret_agenda").on('value', function (snapshot) {
            if (snapshot.val() && availableAgendas.length === 0) {
                database.ref("/session/available_agendas").once('value', function (snapshot) {
                    availableAgendas = snapshot.val();
                    availableAgendas.forEach(function (agenda, index) {
                        availableAgendas[index] = {
                            path: "cards/" + agenda + ".png",
                            alt: agenda,
                            onClick: agendaOnClick
                        };
                    });
                    console.log(availableAgendas);
                    initiateSelect = true;
                })
            } else {
                availableAgendas = null;
            }
        });

    }


    if (initiateSelect) {
        console.log("initiate", initiateSelect);
    }

    function agendaOnClick(e) {
        e.preventDefault();
        console.log(e);
    }


    return (

        <div className="gameplay-container">
            <Navbar isAdmin={isAdmin} />
            {
                selectAgenda ? <ImageModal images={availableAgendas} /> : null
            }
            {
                !isLoading ? <PlayerBar house={house} /> : null
            }

        </div>
    );
}

export default Gameplay;
