import React, { Component } from 'react';
import { database } from '../firebase.js';
import { tokensMap, imagesMap } from '../Util.js';

import '../styles/HouseSideMenu.scss';

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
            let fbTokens = snapshot.val();

            Object.keys(fbTokens).forEach((key) => {
                Object.values(fbTokens[key]).forEach((val) => {
                    let temp = [];
                    if (!this.state[key].includes(val + ".svg")) {
                        temp = [...this.state[key], val + ".svg"];
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
            array = this.props.order ? this.props.order : this.props.houses;

        array.forEach(element => {
            let imgSrc = imagesMap[element.key + "-small.png"],
                tokens = this.state[element.key];

            if (element.key === this.state["moderator"] && !tokens.includes('moderator.svg')) {
                tokens.push('moderator.svg')
            }
            if (element.key === this.state["leader"] && !tokens.includes('leader.svg')) {
                tokens.push('leader.svg')
            }

            tokens = tokens.filter((el) => {
                if (el === 'leader.svg' && element.key !== this.state["leader"]) {
                    return false;
                }
                if (el === 'moderator.svg' && element.key !== this.state["moderator"]) {
                    return false;
                }
                return true;
            })
            contents.push(
                <div className="menu-house" key={element.key}>
                    <div className="token-container" key="token-container">
                        {tokens.length === 0 ? null : tokens.map((src) => {
                            return <img className="token-small" src={tokensMap[src]} alt={src} key={src} />
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