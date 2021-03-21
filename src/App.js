import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import HouseSelection from "./pages/HouseSelection.js";
import GamePlay from "./pages/Gameplay.js";
import PhotoUpload from "./pages/PhotoUpload.js";
import { GameProvider } from "./GameContext";
import Hello from "./components/Hello";

import "./styles/App.scss";

function App() {
  return (
    <GameProvider>
      <Hello />
      {/* <Router>
        <div className="App">
          <Route exact path="/" component={HouseSelection} />
          <Route exact path="/play" component={GamePlay} />
          <Route exact path="/upload" component={PhotoUpload} />
        </div>
      </Router> */}
    </GameProvider>
  );
}

export default App;
