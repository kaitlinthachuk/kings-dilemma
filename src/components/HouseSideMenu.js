import React, { Component } from 'react';
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
            "tork": []
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
    }

    buildHouses() {
        let contents = [];
        this.props.houses.forEach(element => {
            let imgSrc = images("./images/" + element.key + "-small.png"),
                tokens = this.state[element.key];
            contents.push(
                <div className="menu-house" key={element}>
                    <div className="token-container">
                        {tokens.length == 0 ? null : tokens.map((src) => {
                            return <img className="token-small" src={images(src)} alt={src} key={src} />
                        })
                        }
                    </div>
                    <div className="house-container" key={element + "-house"}>
                        <img className="house token-medium" src={imgSrc} alt={element.key} key={imgSrc} />
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