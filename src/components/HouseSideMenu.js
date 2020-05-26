import React, { Component, useRef, useEffect } from 'react';
import { database } from '../firebase.js';

import '../styles/HouseSideMenu.scss';

const images = require.context('../assets', true);

class HouseSideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "crann": [],
            "coden": [],
            "solad": [],
            "tiryll": [],
            "tork": [],
            "moderator": "",
            "leader": ""
        }
        this.buildHouses = this.buildHouses.bind(this);
    }

    componentDidMount() {
        database.ref('session/tokens/').on('value', (snapshot) => {
            let fbTokens = snapshot.val(),
                tokenSrc = './tokens/';

            Object.keys(fbTokens).forEach((key) => {
                Object.values(fbTokens[key]).forEach((val) => {
                    let temp = [];
                    if (!this.state[key].includes(tokenSrc + val + ".svg")) {
                        temp = [...this.state[key], tokenSrc + val + ".svg"];
                        this.setState({
                            [key]: temp
                        })
                    }
                })
            })
        });

        database.ref('session/voting/moderator').on('value', (snapshot) => {
            this.setState({
                "moderator": snapshot.val()
            });
        });
        database.ref('session/voting/leader').on('value', (snapshot) => {
            this.setState({
                "leader": snapshot.val()
            })
        });



    }

    buildHouses() {
        let contents = [],
            array = this.props.order.length !== 0 ? this.props.order : this.props.houses;

        console.log(this.props.houses, this.props.order, array);

        array.forEach(element => {
            let imgSrc = images("./images/" + element.key + "-small.png"),
                tokens = this.state[element.key];

            if (element.key == this.state["moderator"] && !tokens.includes('./tokens/moderator.svg')) {
                tokens.push('./tokens/moderator.svg')
            }
            if (element.key == this.state["leader"] && !tokens.includes('./tokens/leader.svg')) {
                tokens.push('./tokens/leader.svg')
            }

            tokens = tokens.filter((el) => {
                if (el == './tokens/leader.svg' && element.key !== this.state["leader"]) {
                    return false;
                }
                if (el == './tokens/moderator.svg' && element.key !== this.state["moderator"]) {
                    return false;
                }
                return true;
            })
            contents.push(
                <div className="menu-house" key={element}>
                    <div className="token-container">
                        {tokens.length == 0 ? null : tokens.map((src) => {
                            return <img className="token-small" src={images(src)} alt={src} key={src} />
                        })
                        }
                    </div>
                    <div className="house-container" key={element + "-house"} style={{ backgroundImage: `url(${imgSrc})` }}>
                        <h5 className="house-name" key={element.name}>{element.name}</h5>
                    </div>
                </div>
            )
        });
        return contents;
    }


    render() {
        return (
            <div className="side-menu-container" key="main">
                {this.buildHouses()}
            </div>
        );
    }


}

export default HouseSideMenu;