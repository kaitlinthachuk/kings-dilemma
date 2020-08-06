import React, { useState, useEffect } from 'react';
import { database } from '../firebase.js';
const baseURL = 'https://res.cloudinary.com/didsjgttu/image/upload/';

function House(props) {
    const [turn, setTurn] = useState("");

    useEffect(() => {
        database.ref('session/coden/voting_turn').on('value', (snapshot) => {
            if (snapshot.val()) {
                setTurn("coden");
            }
        });

        database.ref('session/crann/voting_turn').on('value', (snapshot) => {
            console.log('checking crann')
            if (snapshot.val()) {
                setTurn("crann");
            }
        });

        database.ref('session/tork/voting_turn').on('value', (snapshot) => {
            if (snapshot.val()) {
                setTurn("tork");
            }
        });

        database.ref('session/tiryll/voting_turn').on('value', (snapshot) => {
            if (snapshot.val()) {
                setTurn("tiryll");
            }
        });

        database.ref('session/solad/voting_turn').on('value', (snapshot) => {
            if (snapshot.val()) {
                setTurn("solad");
            }
        });
    }, [])

    let imgSrc = baseURL + "images/" + props.element.key;

    return (
        <div className={`menu-house ${turn === props.element.key ? "selected-turn" : ""}`}>
            <div className="token-container" key="token-container">
                {props.tokens.length === 0 ? null : props.tokens.map((src) => {
                    return <img className="token-small" src={baseURL + "tokens/" + src} alt={src} key={src} />
                })
                }
            </div>
            <div className="house-container" key={props.element + "-house"} style={{ backgroundImage: `url(${imgSrc})` }}>
                <h5 className="house-name" key={props.element.name}>{props.element.name}</h5>
            </div>
        </div>
    )
}

export default House;