const functions = require('firebase-functions');

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

        Promise.all(promiseArray).then(async () => {
            if (ayePower === nayPower && ayePower !== 0) {
                //there's a tie the mod needs to break;
                await database.child('tie_breaker').set(true);
            } else if (ayePower === nayPower) {
                //everyone passed, mod becomes leader and breaks tie;
                database.child('moderator').once('value', async (snap) => {
                    await database.child('leader').set(snap.val());
                    await database.child('tie_breaker').set(true);
                })
            } else {
                //we have a clear winner, time to process the results
                await database.child('winner_update').set(true);
            }
            return;
        }).catch((e) => console.log(e));
    }
});

exports.tieBroken = functions.database.ref('session/voting/tie_breaker').onUpdate(async (change) => {
    let database = change.after.ref.parent;
    if (change.after.val() === "aye" || change.after.val() === "nay") {
        //tie has been broken by moderator, process winners
        await database.child('winner_update').set(true);
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
            })
        );

        promiseArray.push(
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
            })
        );
        promiseArray.push(
            database.child('pass').once('value', (snapshot) => {
                let obj = Object.entries(snapshot.val()).filter((key) => {
                    return key[0] !== "placeholder";
                });
                passVotes = obj;
            })
        );

        promiseArray.push(
            database.child('leader').once('value', (snapshot) => {
                leader = keyChange[snapshot.val()];
            })
        );

        promiseArray.push(
            database.child('tie_breaker').once('value', (snapshot) => {
                winner = snapshot.val();
            })
        );

        promiseArray.push(
            database.child('available_power').once('value', (snapshot) => {
                availablePower = snapshot.val();
            })
        );

        Promise.all(promiseArray).then(async () => {
            if (ayePower !== nayPower) {
                winner = ayePower > nayPower ? "aye" : "nay";
            }

            await database.child('winner').set(winner);

            let topHouse = winner === "aye" ? maxAye : maxNay,
                winners = winner === "aye" ? ayeVotes : nayVotes,
                winnersTotalPower = winner === "aye" ? ayePower : nayPower;


            //leader has to be on winning side, assuming everybody didnt pass
            if (!(ayePower === nayPower && ayePower === 0)) {
                //first check if leader is on winning side, if so we do nothing
                let leader_on_winning_side = false;
                for (let i = 0; i < winners.length; i++) {
                    if (winners[i][0] === leader) {
                        leader_on_winning_side = true;
                        break;
                    }
                }

                if (!leader_on_winning_side) {
                    //if leader not on winning side, find new leader, see if there is a tie
                    let leader_tie = false, leaders = [[topHouse[0], revKeyChange[topHouse[0]]]];

                    for (let i = 0; i < winners.length; i++) {
                        if (winners[i][1] === topHouse[1] && winners[i][0] !== topHouse[0]) {
                            leaders.push([winners[i][0], revKeyChange[winners[i][0]]]);
                            leader_tie = true;
                        }
                    }
                    if (leader_tie) {
                        await database.child('leader_opt').set(leaders);
                        await database.child('leader_tie').set(true);
                    } else {
                        //there was no tie, we assign the leader to be on the winning team
                        await database.child('leader').set(topHouse[0]);
                    }
                }
            }


            //take power from winners
            winners.forEach(async (pair) => {
                await database.parent.child(pair[0] + "/power").once('value', async (snap) => {
                    await database.parent.child(pair[0] + "/power").set(snap.val() - parseInt(pair[1]));
                });
            })

            //give power to those who gathered it, if any
            let gatheredPow = 0;
            if (passVotes.length !== 0) {
                gatheredPow = Math.floor(availablePower / passVotes.length);
                passVotes.forEach(async (house) => {
                    await database.parent.child(house[0] + "/power").once('value', async (snap) => {
                        await database.parent.child(house[0] + "/power").set(snap.val() + gatheredPow);
                    });
                });
            }

            //put winners power in center for next vote
            await database.child('available_power').set(availablePower - gatheredPow * passVotes.length + winnersTotalPower);
            return;
        }).catch((e) => console.log(e));
    }
})
