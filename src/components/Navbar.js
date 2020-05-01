import React, { Component } from 'react';

import '../styles/Navbar.css';

class Navbar extends Component {
  render() {
    const { buttons } = this.props;

    let components = [];

    buttons.array.forEach(element => {
        components.push(<button className='navbar-button' onClick = {element.onClick}>{element.name}</button>)
    });
    return (
      <div className='navbar'>
        {components}
      </div>
    );
  }
}

export default Navbar;