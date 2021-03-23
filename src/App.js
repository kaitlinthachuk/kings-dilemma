import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { GameProvider } from "./GameContext";
import Game from "./Game";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Route path={"/"}>
        <GameProvider>
          <Game />
        </GameProvider>
      </Route>
    </BrowserRouter>
  );
}

export default App;
