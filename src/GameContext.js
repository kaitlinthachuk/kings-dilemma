import React, { createContext, useEffect, useState } from "react";
import { api } from "./service/fetch";
import { socket } from "./service/socket";

const imageURL = "https://res.cloudinary.com/didsjgttu/image/upload/";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [myHouse, setMyHouse] = useState();
  const [gameState, setGameState] = useState({});
  const [houseData, setHouseData] = useState({});

  useEffect(() => {
    socket.emit("player:join");
    api("houses").then((data) => setHouseData(data));
  }, []);

  const selectHouse = (house) => {
    setMyHouse(house);
    socket.emit("player:selectHouse", house);
  };

  const startGame = () => {
    socket.emit("game:start");
  };

  const selectSecretAgenda = (secretAgenda) => {
    socket.emit("player:selectSecretAgenda", secretAgenda);
  };

  const setVoteOutcomes = (ayeOutcomes, nayOutcomes) => {
    socket.emit("player:setOutcomes", ayeOutcomes, nayOutcomes);
  };

  const setAgendaTokens = (agendaTokenAssignments) => {
    socket.emit("player:setAgendaTokens", agendaTokenAssignments);
  };

  const triggerEndGame = () => {
    socket.emit("player:gameOver");
  }

  const breakTie = (winner) => {
    socket.emit('game:state', winner)
  }

  const breakLeaderTie = (winner) => {
    socket.emit('game:state', winner)
  }

  const playerVote = (vote) => {
    socket.emit('player:vote', vote)
  }

  const updateCrave = (crave) => {
    socket.emit('player:crave', crave)
  }

  const updatePrestige = (prestige) => {
    socket.emit('player:prestige', prestige)
  }

  // set all game state
  socket.on("game:state", (gameState) => {
    console.log(gameState)
    setGameState(gameState)
  });

  const providerValue = {
    myHouse,
    imageURL,
    gameState,
    houseData,
    actions: {
      selectHouse,
      startGame,
      selectSecretAgenda,
      setVoteOutcomes,
      setAgendaTokens,
      triggerEndGame,
      breakTie,
      breakLeaderTie,
      playerVote,
      updateCrave,
      updatePrestige
    },
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
