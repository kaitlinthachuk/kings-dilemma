import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import Navbar from '../components/Navbar.js';
import PlayerBar from '../components/PlayerBar.js';
//import HouseSideMenu from '../components/HouseSideMenu.jsx';

import '../styles/Gameplay.scss';


function Gameplay(props) {
    const location = useLocation();
    const [isVoting, setIsVoting] = useState(false);
    const [house, setHouse] = useState(null);
    const [otherHouses, setOtherHouses] = useState([]);
    const [secretAgenda, setSecretAgenda] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        let { houseState, otherHousesState } = location.state;

        otherHousesState.sort((a, b) => {
            return a.prestige - b.prestige;
        })

        if (otherHousesState[0].prestige !== otherHousesState[1].prestige) {
            otherHousesState[0].tokens.push('mod');
        } else {
            let prestige = otherHousesState[0].prestige
            let tied = otherHousesState.filter((a => {
                return a.prestige == prestige;
            }))

            tied.sort((a, b) => {
                return a.number - b.number;
            });

            for (let i = 0; i < otherHousesState.length(); i++) {
                if (otherHousesState[i].name == tied[0].name) {
                    otherHousesState[i].tokens.push('mod');
                    break;
                }
            }
        }

        if (otherHousesState[4].prestige !== otherHousesState[3].prestige) {
            otherHousesState[4].tokens.push('leader');
        } else {
            let prestige = otherHousesState[4].prestige
            let tied = otherHousesState.filter((a => {
                return a.prestige == prestige;
            }))

            tied.sort((a, b) => {
                return b.number - a.number;
            });

            for (let i = 0; i < otherHousesState.length(); i++) {
                if (otherHousesState[i].name == tied[0].name) {
                    otherHousesState[i].tokens.push('leader');
                    break;
                }
            }
        }

        if (houseState.name == "solad") {
            setIsAdmin(true);
        }
        setHouse(houseState);
        setOtherHouses(otherHousesState);
    }, []);



    return (

        <div className="gameplay-container">
            <Navbar isAdmin={isAdmin} />
            {
                house ? <PlayerBar house={house} /> : null
            }

        </div>
    );
}

export default Gameplay;
