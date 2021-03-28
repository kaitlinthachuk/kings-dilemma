import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { GameProvider } from "./GameContext";
import ViewSwitch from "./ViewSwitch";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path={"/"}>
          <GameProvider>
            <ViewSwitch />
          </GameProvider>
        </Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
