import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import client from './fetchClient'

const serverURL = process.env.SERVER_URL || "http://localhost:3000";
const imageURL = "https://res.cloudinary.com/didsjgttu/image/upload/";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [myHouse, setMyHouse] = useState(
    process.env.NODE_ENV === "production" && localStorage.getItem("house")
  );
  const [gameState, setGameState] = useState({});
  const [houseData, setHouseData] = useState({})
  const { sessionId } = useParams();
  const socket = io(serverURL);

  useEffect(() => {
    socket.emit("player:join", { sessionId });
    client("houses").then((data) => setHouseData(data));
  }, []);

  const selectHouse = (house) => {
    setMyHouse(house);
    localStorage.setItem("house", house);
    socket.emit("player:selectHouse", { sessionId, house });
  };

  const startGame = () => {
    socket.emit("game:start", { sessionId });
  };

  const selectSecretAgenda = (secretAgenda) => {
    socket.emit("player:selectSecretAgenda", {
      sessionId,
      house: myHouse,
      secretAgendaName: secretAgenda,
    });
  };

  // set all game state
  socket.on("game:state", (gameState) => setGameState(gameState));

  const providerValue = {
    myHouse,
    imageURL,
    gameState,
    houseData,
    actions: {
      selectHouse,
      startGame,
      selectSecretAgenda,
    },
  };

  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
