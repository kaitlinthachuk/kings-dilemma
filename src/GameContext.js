import React, { createContext, useEffect, useState } from 'react'
import { io } from "socket.io-client";

const serverURL = "http://localhost:3000";

const GameContext = createContext(undefined)

export const GameProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const roomId = window.location.pathname.slice(1)
    const socket = io(serverURL);
    socket.on('hello', (msg) => {
      setIsConnected(true)
    })
    socket.emit('hi')
  }, [])

  const providerValue = {
    isConnected, serverURL
  }

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContext
