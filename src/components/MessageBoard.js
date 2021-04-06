import React, { useContext } from 'react';
import GameContext from '../GameContext'

import '../styles/MessageBoard.scss';

function MessageBoard() {
    const { gameState: { message } } = useContext(GameContext)

    return (
        <div className="message-board-container">
            <h3>Hello it's a message</h3>
        </div>
    )
}

export default MessageBoard;