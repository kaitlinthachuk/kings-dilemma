import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import HouseSelection from './pages/HouseSelection.js';
import GamePlay from './pages/Gameplay.js';

import './styles/App.scss';


function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={HouseSelection} />
        <Route exact path="/play" component={GamePlay} />
      </div>
    </Router>
  );
};

export default App;
