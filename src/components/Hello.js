import React, {useContext} from 'react'
import GameContext from '../GameContext'

const Hello = () => {
  const {isConnected} = useContext(GameContext)

  return <div>is connected: {isConnected.toString()}</div>
}

export default Hello