import React, { useContext } from 'react';
import GameContext from '../GameContext'

function House(props) {
    const { imageURL,
        gameState: {
            turn },
    } = useContext(GameContext)

    let imgSrc = imageURL + "images/" + props.player.house + ".jpg"

    function createTokens() {
        props.player.agendaTokens.map((token) => {
            let tokenString = token.resource + "-" + token.type
            return <img className="token-small" src={imageURL + "tokens/" + tokenString + ".jpg"} alt={tokenString} key={tokenString} />
        })
    }

    return (
        <div className={`menu-house ${turn === props.player.house ? "selected-turn" : ""}`}>
            <div className="token-container" key="token-container">
                {createTokens()}
            </div>
            <div className="house-container" key={props.player + "-house"} style={{ backgroundImage: `url(${imgSrc})` }}>
                <h5 className="house-name" key={props.player.house}>{props.player.house}</h5>
            </div>
        </div>
    )
}

export default House;