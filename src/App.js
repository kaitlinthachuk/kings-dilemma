import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { GameProvider } from "./GameContext";
import Game from "./Game";
import HouseSelection from "./pages/HouseSelection"

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Route path={"/"}>
        <GameProvider>
          <HouseSelection />
        </GameProvider>
      </Route>
    </BrowserRouter>
  );
}

export default App;
