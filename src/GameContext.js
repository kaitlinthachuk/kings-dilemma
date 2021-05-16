import React, { createContext, useEffect, useState } from "react";
import { api } from "./service/fetch";
import { socket } from "./service/socket";

const imageURL = "https://res.cloudinary.com/didsjgttu/image/upload/";
const webcamRoomId = "kings-dilemma-1984nidjhs913y4193";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [myHouse, setMyHouse] = useState();
  const [gameState, setGameState] = useState({});
  const [houseData, setHouseData] = useState({});

  useEffect(() => {
    socket.emit("player:join");
    api("houses").then((data) => setHouseData(data));
  }, []);

  const selectHouse = (house, { prestige, crave }) => {
    setMyHouse(house);
    socket.emit("player:selectHouse", house, prestige, crave);
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
  };

  const breakTie = (winner) => {
    socket.emit("player:breakTie", winner);
  };

  const breakLeaderTie = (winner) => {
    socket.emit("player:breakLeaderTie", winner);
  };

  const playerVote = (vote) => {
    socket.emit("player:vote", vote);
  };

  // set all game state
  socket.on("game:state", (gameState) => {
    //console.log(gameState);
    setGameState(gameState);
  });

  const providerValue = {
    myHouse,
    imageURL,
    gameState,
    houseData,
    webcamRoomId,
    actions: {
      selectHouse,
      selectSecretAgenda,
      setVoteOutcomes,
      setAgendaTokens,
      triggerEndGame,
      breakTie,
      breakLeaderTie,
      playerVote,
    },
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
