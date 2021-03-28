import React, { createContext, useEffect, useState } from "react";
import { api } from "./service/fetch";
import { socket } from "./service/socket";

const imageURL = "https://res.cloudinary.com/didsjgttu/image/upload/";
const chronicleStickerUrl = "https://res.cloudinary.com/didsjgttu/image/upload/v1613963531/ucedkr9lkc4p2blyrvi2.jpg";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [myHouse, setMyHouse] = useState(
    process.env.NODE_ENV === "production" && localStorage.getItem("house")
  );
  const [gameState, setGameState] = useState({});
  const [houseData, setHouseData] = useState({});

  useEffect(() => {
    socket.emit("player:join");
    api("houses").then((data) => setHouseData(data));
  }, []);

  const selectHouse = (house) => {
    setMyHouse(house);
    // store house so subsequent visits can remember house
    localStorage.setItem("house", house);
    socket.emit("player:selectHouse", house);
  };

  const startGame = () => {
    socket.emit("game:start");
  };

  const selectSecretAgenda = (secretAgenda) => {
    socket.emit("player:selectSecretAgenda", myHouse, secretAgenda);
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
    socket.emit('player:crave', myHouse, crave)
  }

  const updatePrestige = (prestige) => {
    socket.emit('player:prestige', myHouse, prestige)
  }

  // set all game state
  socket.on("game:state", (gameState) => setGameState(gameState));

  const providerValue = {
    myHouse,
    imageURL,
    chronicleStickerUrl,
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
