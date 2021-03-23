import React, { createContext, useEffect, useState } from "react";
import { api } from "./service/fetch";
import { socket } from "./service/socket";

const imageURL = "https://res.cloudinary.com/didsjgttu/image/upload/";

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
