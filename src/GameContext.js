import React, {createContext, useEffect, useState} from 'react'
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const GameContext = createContext(undefined)

export const GameProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const roomId = window.location.pathname.slice(1)
    const socket = io(URL);
    socket.on('hello', (msg) => {
      setIsConnected(true)
    })
    socket.emit('hi')
  }, [])

  const providerValue = {
    isConnected
  }

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContext
