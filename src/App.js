import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { initUrls } from './Util.js';


import HouseSelection from './pages/HouseSelection.js';
import GamePlay from './pages/Gameplay.js';
import PhotoUpload from './pages/PhotoUpload.js';

import './styles/App.scss';


function App() {
  initUrls();
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={HouseSelection} />
        <Route exact path="/play" component={GamePlay} />
        <Route exact path='/upload' component={PhotoUpload} />
      </div>
    </Router>
  );
};

export default App;
