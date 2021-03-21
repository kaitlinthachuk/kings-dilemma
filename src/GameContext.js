import React, { createContext, useEffect, useState } from 'react'
import { io } from "socket.io-client";

const serverURL = "http://localhost:3000";
const imageURL = 'https://res.cloudinary.com/didsjgttu/image/upload/';

const GameContext = createContext(undefined)

export const GameProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [turn, setTurn] = useState("")
  const [leader, setLeader] = useState("")
  const [moderator, setModerator] = useState("")
  const [state, setState] = useState("")
  const [secretAgendas, setSecretAgendas] = useState([])
  const [players, setPlayers] = useState([])
  const [turnOrder, setTurnOrder] = useState([])
  const [availablePower, setAvailablePower] = useState(0)
  const [votes, setVotes] = useState([])
  const [ayeOutcomes, setAyeOutcomes] = useState([])
  const [nayOutcomes, setNayOutcomes] = useState([])
  const [leaderTie, setLeaderTie] = useState(false)
  const [leaderChoice, setLeaderChoice] = useState([])
  const [voteTie, setVoteTie] = useState(false)
  const [winner, setWinner] = useState("")
  let socket, roomId

  useEffect(() => {
    roomId = window.location.pathname.slice(1)
    socket = io(serverURL);
    socket.on('hello', (msg) => {
      setIsConnected(true)
    })
    socket.emit('hi')
  }, [])

  emitSecretAgenda(house, secretAgenda){
    socket.emit('player:secretAgenda', { "house": house, "chosenAgenda": secretAgenda })
  }



  const providerValue = {
    isConnected, serverURL, imageURL, turn, leader, moderator, state, secretAgendas,
    players, turnOrder, availablePower, votes, ayeOutcomes, nayOutcomes, leaderTie,
    leaderChoice, voteTie, winner, emitSecretAgenda
  }

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContext
