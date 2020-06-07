import React, { useEffect, useState } from 'react';
import { database } from '../firebase.js';
import VoteDisplay from "../components/VoteDisplay.js";
import VoteResult from "../components/VoteResult.js";
import HoverCard from "../components/HoverCard.js";
import { tokensMap, imagesMap, processWinner } from '../Util.js';


import '../styles/VotingManager.scss';



function VotingManager(props) {
    const [ayeVotes, setAyeVotes] = useState([]);
    const [nayVotes, setNayVotes] = useState([]);
    const [passVotes, setPassVotes] = useState([]);
    const [ayeOutcomes, setAyeOutcomes] = useState([]);
    const [nayOutcomes, setNayOutcomes] = useState([]);
    const [power, setPower] = useState([]);
    const [maxComitted, setMaxComitted] = useState(1);
    const [voteDone, setVoteDone] = useState(false);


    useEffect(() => {
        database.ref('session/voting/aye/voters').on('value', (snapshot) => {
            let obj = Object.entries(snapshot.val()).filter((key) => {
                return key[0] !== "placeholder";
            });
            setAyeVotes(obj);
        });

        database.ref('session/voting/nay/voters').on('value', (snapshot) => {
            let obj = Object.entries(snapshot.val()).filter((key) => {
                return key[0] !== "placeholder";
            });
            setNayVotes(obj);
        });

        database.ref('session/voting/pass').on('value', (snapshot) => {
            let obj = Object.keys(snapshot.val()).filter((key) => {
                return key !== "placeholder";
            });
            setPassVotes(obj);
        });

        database.ref('session/voting/aye/outcomes').on('value', (snapshot) => {
            //setAyeOutcomes(Object.entries(snapshot.val()));
            setAyeOutcomes(initOutcomes(snapshot.val()));
        });

        database.ref('session/voting/nay/outcomes').on('value', (snapshot) => {
            //setNayOutcomes(Object.entries(snapshot.val()));
            setNayOutcomes(initOutcomes(snapshot.val()));
        });

        database.ref('session/voting/voting_done').on('value', (snapshot) => {
            setVoteDone(snapshot.val());
        });

        database.ref('session/voting/available_power').on('value', (snapshot) => {
            let powerTokens = [],
                powerNum = snapshot.val();

            while (powerNum > 0) {
                if (powerNum - 10 >= 0) {
                    powerTokens.push(
                        <img src={tokensMap["power-10.svg"]} key={powerNum} alt="power-10" className="power-token token-med" />)
                    powerNum -= 10;
                } else if (powerNum - 5 >= 0) {
                    powerTokens.push(
                        <img src={tokensMap["power.svg"]} key={powerNum} alt="power-5" className="power-token token-med" />)
                    powerNum -= 5;
                } else {
                    powerTokens.push(
                        <img src={tokensMap["power.svg"]} key={powerNum} alt="power-1" className="power-token token-small" />)
                    powerNum--;
                }
            }

            setPower(powerTokens);

        });

    }, [])


    function initOutcomes(vals) {
        let outcomes = [],
            i = 0;
        for (const val in vals) {
            outcomes.push({
                key: val,
                token: vals[val],
                transform: `translate(${i * getRandom(10)}px, ${i * getRandom(10)}px) rotate(${getRandom(30)}deg)`,
            });
            i++;
        }
        return outcomes;
    }

    function getRandom(scale) {
        return (Math.random() * 2 - 1) * scale;
    }

    console.log("manager rendering");

    return (
        <div className="voting-container" style={{ display: props.isVisible ? "" : "none", transform: `scale(${props.scale})` }}>
            <div className="aye-container" key="aye-container">
                <table className="aye" key="aye">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Aye
                            </th>
                        </tr>
                        {ayeVotes.map((val) => {
                            if (val[1] > maxComitted) {
                                setMaxComitted(val[1]);
                            }
                            return (<tr key={val[0]}>
                                <td>{val[0]}</td>
                                <td>{val[1]}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <div className="voting-card-container">
                <HoverCard image={imagesMap["voting.png"]} refreshImg={voteDone} />
            </div>
            <div className="nay-container" key="nay-container">
                <table className="nay" key="nay">
                    <tbody>
                        <tr>
                            <th colSpan="2">
                                Nay
                            </th>
                        </tr>
                        {nayVotes.map((val) => {
                            if (val[1] > maxComitted) {
                                setMaxComitted(val[1]);
                            }
                            return (<tr key={val[0]}>
                                <td>{val[0]}</td>
                                <td>{val[1]}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>

            <div className="aye-scale">
                <img src={tokensMap["aye-scale.svg"]} key="scales" alt="scales" />
                <div className="aye-token-container">
                    {ayeOutcomes.map((val) =>
                        <img
                            src={tokensMap['outcome-' + val.token + ".svg"]}
                            key={val.key}
                            alt="outcome"
                            className="aye-outcome-token token-med"
                            style={{ transform: val.transform }}
                        />
                    )}
                </div>
            </div>
            <div className="nay-scale">
                <img src={tokensMap["nay-scale.svg"]} key="scales" alt="scales" />
                <div className="nay-token-container">
                    {nayOutcomes.map((val) =>
                        <img
                            src={tokensMap['outcome-' + val.token + ".svg"]}
                            key={val.key}
                            alt="outcome"
                            className="nay-outcome-token token-med"
                            style={{ transform: val.transform }}
                        />
                    )}
                </div>
            </div>

            <div className="available-power">
                {power}
            </div>
            {
                voteDone ?
                    <VoteResult house={props.house} ayeVotes={ayeVotes} nayVotes={nayVotes} passVotes={passVotes} gatherPower={power} /> :
                    <VoteDisplay house={props.house} maxComitted={maxComitted} />
            }
        </div>
    );
}

export default VotingManager;