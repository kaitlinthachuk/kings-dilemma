import { storage } from './firebase.js';

const storageRef = storage.ref();

const cards = ["extremist-board.svg", "extremist.png", "greedy-board.svg", "greedy.png", "moderate-board.svg", "moderate.png",
    "opportunist-board.svg", "opportunist.png", "opulent-board.svg", "opulent.png", "rebel-board.svg", "rebel.png", "laurel.svg"];

const images = ["coden-small.png", "crann-small.png", "solad-small.png", "tork-small.png", "tiryll-small.png",
    "lore.png", "map.png", "rules.png", "symbols.png", "stickers.png", "voting.png"];

const tokens = ["aye-scale.svg", "coin.svg", "coin-10.svg", "influence-negative.svg", "influence-positive.svg", "knowledge-negative.svg",
    "knowledge-positive.svg", "leader.svg", "moderator.svg", "nay-scale.svg", "morale-positive.svg", "morale-negative.svg", "outcome-chronicle-neg.svg", "outcome-chronicle-pos.svg", "outcome-influence-neg.svg",
    "outcome-influence-pos.svg", "outcome-knowledge-neg.svg", "outcome-knowledge-pos.svg", "outcome-morale-neg.svg", "outcome-morale-pos.svg",
    "outcome-wealth-neg.svg", "outcome-wealth-pos.svg", "outcome-welfare-neg.svg", "outcome-welfare-pos.svg", "power.svg", "power-10.svg", "wealth-negative.svg",
    "wealth-positive.svg", "welfare-negative.svg", "welfare-positive.svg"];

const cardsMap = {};
const imagesMap = {};
const tokensMap = {};
let cardJson;

export async function initUrls() {
    await Promise.all(initCards()).then((urls) => {
        cards.forEach((element, index) => {
            cardsMap[element] = urls[index];
        })
        return Promise.all(initImages()).then((urls) => {
            images.forEach((element, index) => {
                imagesMap[element] = urls[index];
            })
            return Promise.all(initTokens()).then((urls) => {
                tokens.forEach((element, index) => {
                    tokensMap[element] = urls[index];
                })
                return fetchCardJSON().then(function (url) {
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'json';
                    xhr.onload = function (event) {
                        cardJson = xhr.response;
                        console.log("card loaded");
                    };
                    xhr.open('GET', url);
                    xhr.send();
                });
            });
        });
    });
}

function initCards() {
    let promiseArray = [];

    cards.forEach(element => {
        promiseArray.push(storageRef.child("cards/" + element).getDownloadURL());
    });

    return promiseArray;
}

function initImages() {
    let promiseArray = [];

    images.forEach(element => {
        promiseArray.push(storageRef.child("images/" + element).getDownloadURL());
    });
    return promiseArray;
}

function initTokens() {
    let promiseArray = [];

    tokens.forEach(element => {
        promiseArray.push(storageRef.child("tokens/" + element).getDownloadURL());
    });

    return promiseArray;
}

function fetchCardJSON() {
    return storageRef.child('cards/cards.json').getDownloadURL();
}


export { cardJson, cardsMap, imagesMap, tokensMap }