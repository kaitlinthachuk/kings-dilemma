// import React, { Component } from 'react';

// import Navbar from '../components/Navbar.js';
// import PlayerBar from '../components/PlayerBar.jsx';
// import HouseSideMenu from '../components/HouseSideMenu.jsx';

// import '../styles/Page.scss';


// class Gameplay extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       width: window.innerWidth,
//     };

//     this.handleWindowResize = this.handleWindowResize.bind(this);
//   }

//   componentDidMount() {
//     window.addEventListener('resize', this.handleWindowResize);
//   }

//   componentWillUnmount() {
//     window.removeEventListener('resize', this.handleWindowResize);
//   }

//   render() {
//       const { topNavButtons, house, remainingHouses } = this.props;
//     const { width } = this.state;
//     return (
//       <div className="layout">
//         <Navbar buttons = {topNavButtons}></Navbar>
//         <div id={id} className="page">
//           {this.props.children}
//         </div>
//         { width <= 1000  ?
//         <HouseSideMenu houses = {remainingHouses}></HouseSideMenu>
//          :
//           null
//         }
//         <PlayerBar house = {house} ></PlayerBar>
//       </div>
//     );
//   }

//   handleWindowResize() {
//     this.setState({
//       width: window.innerWidth,
//     })
//   }
// }

// export default Gameplay;
