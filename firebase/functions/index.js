const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: functions.config().cloudinary.name,
    api_key: functions.config().cloudinary.key,
    api_secret: functions.config().cloudinary.secret
});

exports.processVotes = functions.database.ref('session/voting/voting_done').onUpdate((change) => {
    let database = change.after.ref.parent;
    if (change.after.val()) {
        let ayePower = 0, nayPower = 0, promiseArray = [];

        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('/aye/voters').once('value', (snapshot) => {
                    let obj = Object.entries(snapshot.val()).filter((key) => {
                        return key[0] !== "placeholder";
                    });
                    obj.forEach(element => {
                        ayePower += element[1];
                    });

                    resolve();
                });
            })
        );

        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('/nay/voters').once('value', (snapshot) => {
                    let obj = Object.entries(snapshot.val()).filter((key) => {
                        return key[0] !== "placeholder";
                    });
                    obj.forEach(element => {
                        nayPower += element[1];
                    });

                    resolve();
                });
            })
        );

        return Promise.all(promiseArray).then((values) => {
            if (ayePower === nayPower && ayePower !== 0) {
                //there's a tie the mod needs to break;
                database.child('tie_breaker').set(true);
            } else if (ayePower === nayPower) {
                //everyone passed, mod becomes leader and breaks tie;
                database.child('moderator').once('value', (snap) => {
                    database.child('leader').set(snap.val());
                    database.child('tie_breaker').set(true);
                })
            } else {
                //we have a clear winner, time to process the results
                database.child('winner_update').set(true);
            }
            return null;
        })
    } else {
        return null;
    }
});

exports.tieBroken = functions.database.ref('session/voting/tie_breaker').onUpdate((change) => {
    let database = change.after.ref.parent;
    if (change.after.val() === "aye" || change.after.val() === "nay") {
        //tie has been broken by moderator, process winners
        return database.child('winner_update').set(true);
    } else {
        return null;
    }
});

exports.processWinners = functions.database.ref('session/voting/winner_update').onUpdate((change) => {
    let database = change.after.ref.parent;
    if (change.after.val()) {
        let ayeVotes = [], nayVotes = [], passVotes = [], availablePower = 0, ayePower = 0, nayPower = 0,
            maxAye = ["", 0], maxNay = ["", 0],
            winner, promiseArray = [], leader;

        const keyChange = {
            "House Stormcloak": "solad",
            "House Rhinehardt": "tork",
            "House Arborstella": "coden",
            "House Irvine": "tiryll",
            "House Flora": "crann"
        }

        const revKeyChange = {
            "solad": "House Stormcloak",
            "tork": "House Rhinehardt",
            "coden": "House Arborstella",
            "tiryll": "House Irvine",
            "crann": "House Flora"
        }


        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('/aye/voters').once('value', (snapshot) => {
                    let obj = Object.entries(snapshot.val()).filter((key) => {
                        return key[0] !== "placeholder";
                    });
                    obj.forEach(element => {
                        ayePower += element[1];
                        ayeVotes.push([keyChange[element[0]], element[1]]);
                        if (element[1] > maxAye[1]) {
                            maxAye = [keyChange[element[0]], element[1]];
                        }
                    });
                    resolve();
                });
            })
        );

        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('/nay/voters').once('value', (snapshot) => {
                    let obj = Object.entries(snapshot.val()).filter((key) => {
                        return key[0] !== "placeholder";
                    });
                    obj.forEach(element => {
                        nayPower += element[1];
                        nayVotes.push([keyChange[element[0]], element[1]]);
                        if (element[1] > maxNay[1]) {
                            maxNay = [keyChange[element[0]], element[1]];
                        }
                    });
                    resolve();
                });
            })
        );
        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('pass').once('value', (snapshot) => {
                    let obj = Object.entries(snapshot.val()).filter((key) => {
                        return key[0] !== "placeholder";
                    });
                    passVotes = obj;
                    resolve();
                });
            })
        );

        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('leader').once('value', (snapshot) => {
                    leader = snapshot.val();
                    resolve();
                });
            })
        );

        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('tie_breaker').once('value', (snapshot) => {
                    winner = snapshot.val();
                    resolve();
                });
            })
        );

        promiseArray.push(
            new Promise((resolve, reject) => {
                database.child('available_power').once('value', (snapshot) => {
                    availablePower = snapshot.val();
                    resolve();
                });
            })
        );

        return Promise.all(promiseArray).then((vals) => {
            if (ayePower !== nayPower) {
                winner = ayePower > nayPower ? "aye" : "nay";
            }

            database.child('winner').set(winner);

            let topHouse = winner === "aye" ? maxAye : maxNay,
                winners = winner === "aye" ? ayeVotes : nayVotes,
                winnersTotalPower = winner === "aye" ? ayePower : nayPower;


            //leader has to be on winning side, assuming everybody didnt pass
            if (!(ayePower === nayPower && ayePower === 0)) {
                let leader_tie = false, leaders = [[topHouse[0], revKeyChange[topHouse[0]]]];
                for (let i = 0; i < winners.length; i++) {
                    if (winners[i][1] === topHouse[1] && winners[i][0] !== topHouse[0]) {
                        leaders.push([winners[i][0], revKeyChange[winners[i][0]]]);
                        leader_tie = true;
                    }
                }

                if (leader_tie) {
                    database.child('leader_opt').set(leaders);
                    database.child('leader_tie').set(true);
                } else {
                    database.child('leader').set(topHouse[0]);
                }
            }


            //take power from winners
            winners.forEach((pair) => {
                database.parent.child(pair[0] + "/power").once('value', (snap) => {
                    database.parent.child(pair[0] + "/power").set(snap.val() - parseInt(pair[1]));
                });
            })

            //give power to those who gathered it, if any
            let gatheredPow = 0;
            if (passVotes.length !== 0) {
                gatheredPow = Math.floor(availablePower / passVotes.length);
                passVotes.forEach((house) => {
                    database.parent.child(house[0] + "/power").once('value', (snap) => {
                        database.parent.child(house[0] + "/power").set(snap.val() + gatheredPow);
                    });
                });

                //put winners power in center for next vote
                database.child('available_power').set(availablePower - gatheredPow * passVotes.length + winnersTotalPower);
            }
            return null;

        })
    } else {
        return null;
    }
});

// uploadPhoto function

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/', (req, res) => {
    // console.log("request", req);
    try {
        cloudinary.uploader.upload(
            req.body.image,
            {
                resource_type: "image",
                public_id: req.body.endpoint
            },
            (data) => {
                res.send(data);
            }
        );
    } catch (e) {
        res.status(500).send(e.message);
    }
    // res.status(200).send("Photo Uploaded");
});

// Expose Express API as a single Cloud Function:
exports.uploadPhoto = functions.https.onRequest(app);
