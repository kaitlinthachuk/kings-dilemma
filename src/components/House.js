import React, { useContext } from 'react';
import GameContext from '../GameContext'

function House(props) {
    const { imageURL,
        houseData,
        gameState: {
            turn },
    } = useContext(GameContext)

    let imgSrc = imageURL + "images/" + props.player.house

    function createTokens() {
        let tokenArray = props.player.agendaTokens.map((token) => {
            let tokenString = token.resource + "-" + token.type
            return <img className="token-small" src={imageURL + "tokens/" + tokenString} alt={tokenString} key={tokenString} />
        })

        if (props.player.isLeader) {
            tokenArray.push(<img className="token-small" src={imageURL + "tokens/leader"} alt="leader" key="leader" />)
        }
        if (props.player.isModerator) {
            tokenArray.push(<img className="token-small" src={imageURL + "tokens/moderator"} alt="moderator" key="moderator" />)
        }

        return tokenArray
    }

    return (
        <div className={`menu-house ${turn === props.player.house ? "selected-turn" : ""}`}>
            <div className="token-container" key="token-container">
                {createTokens()}
            </div>
            <div className="house-container" key={props.player.house + "-house"} style={{ backgroundImage: `url(${imgSrc})` }}>
                <h5 className="house-name" key={props.player.house}>{houseData[props.player.house].houseName}</h5>
            </div>
        </div>
    )
}

export default House;