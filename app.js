//Module--express
const express = require('express')
const app = express()

//Module--convert-csv-to-json
const csvToJson = require('convert-csv-to-json');

//Module--File System module
const fs = require('fs');

//Module--mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ipl-db');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected to db");
});

// bring in models
let MatchModel = require('./models/match');
let DeliveryModel = require('./models/delivery');

// project directory
app.use(express.static(__dirname + '/public'));

// compare by _.id -- used by sort()
function compare_ID(a, b) {
    if (a._id < b._id)
        return -1;
    if (a._id > b._id)
        return 1;
    return 0;
}

// compare by econ -- used by sort()
function compareEcon(a, b) {
    if (a.econ < b.econ)
        return -1;
    if (a.econ > b.econ)
        return 1;
    return 0;
}

//get json file from csv file
function getJSONfromMatchesCSV() {

    let fileInputName = 'csv/matches.csv';
    let fileOutputName = 'json/matches.json';
    csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName, fileOutputName);

}

//clear from db collection
function clearMatchesDB() {

    MatchModel.deleteMany({}, function (error) {
        if (error) {
            console.log("delete many error: " + error);
            return;
        }
        console.log("deleted many");
    });

}

// populate db from JSON file
function populateMatchesDB() {

    fs.readFile('json/matches.json', function (err, data) {
        if (err) {
            console.log("read file error: " + err);
            return;
        }
        // insert all documents
        MatchModel.insertMany(JSON.parse(data), function (error, docs) {
            if (err) {
                console.log("insert many error: " + err);
                return;
            }
            console.log("inserted many");
        });
    });

}

// find no of matches played each year--from matches database
function findNoOfMatchesPlayed(req, res) {
    console.log("Received request to /api/numberOfMatches");
    var noOfMatches = [];
    var noOfArrayItems = 0;

    let playedPromise = new Promise(function (resolve, reject) {
        for (let i = 2008; i <= 2017; i++) {
            MatchModel.count({
                season: i
            }, function (err, c) {
                if (err) {
                    console.log("count error: " + err);
                    return;
                }
                // noOfMatches.splice(i - 2008, 0, c); // insert c at index i-2008, while deleting 0 items
                noOfMatches[i - 2008] = c;
                console.log("Number of matches played in " + i.toString() + " : " + c);
                console.log("Value in array for year" + i.toString() + " : " + noOfMatches[i - 2008]);
                noOfArrayItems++;
                console.log("no of array items: " + noOfArrayItems);
                if (noOfArrayItems == 10) {
                    resolve(noOfMatches);
                    console.log("is there anybody out there?");
                }
            });
        }
    });
    // wait for the queries to finish

    playedPromise.then(function (result) {

        console.log("dis" + result);
        res.send(result);

    });
}

// find no of matches won by each team over the years--from matches database
async function findNoOfMatchesWon(req, res) {
    console.log("Received request to /api/stackedBarGraph");

    //find all the unique years
    let years = new Set();

    let yearsPromise = new Promise(function (resolve, reject) {
        MatchModel.find({}, {
            '_id': 0,
            'season': 1
        }, function (err, docs) {

            if (err) {
                reject(error);
            } else {
                resolve(docs);
            }
        })
    });

    let yearsResult = await yearsPromise;
    // console.log("does this work?: " + yearsResult);

    yearsResult.forEach(function (arrayItem) {
        //console.log("Years item: " + arrayItem);
            years.add(arrayItem.season);
    });
    console.log("Years length: " + years.size);
    for (let year of years) console.log(year);

    //find all the unique teams
    let teams = new Set();

    let teamsPromise = new Promise(function (resolve, reject) {
        MatchModel.find({}, {
            '_id': 0,
            'winner': 1
        }, function (err, docs) {

            if (err) {
                reject(error);
            } else {
                resolve(docs);
            }
        })
    });

    let teamsResult = await teamsPromise;

    teamsResult.forEach(function (arrayItem) {
        if (arrayItem.winner.trim() != "")
            teams.add(arrayItem.winner);
    });
    console.log("Teams length: " + teams.size);
    for (let team of teams) console.log(team);

    console.log("teams.size: " + teams.size);
    console.log("years.size: " + years.size);

    let objs = csvToJson.fieldDelimiter(',').getJsonFromCsv("csv/matches.csv");

    let teamsThisYear = {};
    let winnerPerYear = objs.reduce((acc, obj) => {
        teamsThisYear = {};
        console.log(JSON.stringify(obj));
        console.log(JSON.stringify(obj.season) +", "+ JSON.stringify(obj.winner)+"\n\n\n");
        if (obj.season in acc) {
            if (acc[obj.season][obj.winner]) {
                acc[obj.season][obj.winner]++;
            } else {
                acc[obj.season][obj.winner] = 1;
            }
        } else {
            teamsThisYear[obj.winner] = 1;
            acc[obj.season] = teamsThisYear;
 
        }
        return acc;
    }, {});
    let teamsArray = Array.from(teams);
    let winner = Object.values(winnerPerYear);
    //console.log("winner: "+JSON.stringify(winner));
    let winnerData = teamsArray.map((name) => {
        var wins = winner.map((data) => {
            if (typeof (data[name]) == "undefined") {
                return 0;
            } else {
                return data[name];
            }
 
        })
        return {
            'name': name,
            'data': wins
        };
    });

    console.log("The data is: "+winnerPerYear);
    res.send({winnerData});
}

function findExtraRunsConceded(req, res) {

   let matchObjs = csvToJson.fieldDelimiter(',').getJsonFromCsv("csv/matches.csv");
   let deliveryObjs = csvToJson.fieldDelimiter(',').getJsonFromCsv("csv/deliveries.csv");

   let matchId = matchObjs.filter((data) => {
       return (data["season"] == "2016");
   }).map((key) => {
       return key.id;
   });
   let file = deliveryObjs.filter((data) => {
       return (matchId.includes(data["match_id"]));
   });
   let extraRuns = file.reduce(function (acc, data) {
       if (data.bowling_team in acc) {
           acc[data.bowling_team] += parseInt(data["extra_runs"]);
       } else {
           acc[data.bowling_team] = parseInt(data["extra_runs"]);
       }
       return acc;
   }, {});
   

   console.log(extraRuns);
   res.send(extraRuns);

}

function findTopEconomicalBowlers(req, res) {

    //find (no. of balls that were either wides or no balls) per bowler for 2016

    let wideOrNoBallPromise = new Promise(function (resolve, reject) {
        DeliveryModel.aggregate([{

                // match 2016
                $match: {

                    match_id: {
                        $lte: 576
                    },

                    match_id: {
                        $gte: 518
                    },
                    //either a wide or a no ball

                    $or: [{
                            wide_runs: {
                                $ne: 0
                            }
                        } // it is a wide ball when wide_runs != 0
                        ,
                        {
                            noball_runs: {
                                $ne: 0
                            }
                        } // it is a no ball when no_runs != 0
                    ]
                }
            },
            // group documents by bowler
            // sum (total_runs - bye_runs - legbye_runs) for each bowler
            {
                $group: {
                    _id: '$bowler',

                    wideOrNoBalls: {
                        "$sum": 1
                    },
                }
            },
        ], function (err, items) {
            // res.send(items);
            resolve(items);
        });
    });


    wideOrNoBallPromise.then(function (wideOrNoBallsArray) {
        //res.send(wideOrNoBallsArray);
        // find total no. of balls bowled--including wide & no balls
        // find runs--total - bye - legbye
        DeliveryModel.aggregate([{

                // match 2016
                $match: {
                    match_id: {
                        $lte: 576
                    },
                    match_id: {
                        $gte: 518
                    },
                }
            },
            // group documents by bowler
            // sum (total_runs - bye_runs - legbye_runs) for each bowler
            {
                $group: {
                    _id: '$bowler',
                    runs: {
                        "$sum": {
                            "$subtract": [{
                                "$add": ["$total_runs", "$bye_runs"]
                            }, "$legbye_runs"]
                        }
                    },

                    balls: {
                        "$sum": 1
                    },
                }
            }
        ], function (err, totalBallsAndRunsArray) {

            wideOrNoBallsArray.sort(compare_ID);
            console.log("\n\n______________________________________________________________________________________________________________________________________");
            console.log("wide and no balls array \n\n" + JSON.stringify(wideOrNoBallsArray));
            console.log("______________________________________________________________________________________________________________________________________\n\n");

            totalBallsAndRunsArray.sort(compare_ID);
            console.log("\n\n______________________________________________________________________________________________________________________________________");
            console.log("total balls and runs array \n\n" + JSON.stringify(totalBallsAndRunsArray));
            console.log("______________________________________________________________________________________________________________________________________\n\n");

            // subtract wideOrNo balls from total balls
            wideOrNoBallsArray.forEach(function (wideOrNoBalls) {
                totalBallsAndRunsArray.forEach(function (totalBallsAndRuns) {
                    if (wideOrNoBalls._id == totalBallsAndRuns._id) {
                        totalBallsAndRuns.balls -= wideOrNoBalls.wideOrNoBalls;
                    }
                });
            });

            console.log("\n\n______________________________________________________________________________________________________________________________________");
            console.log("new total balls and runs array \n\n" + JSON.stringify(totalBallsAndRunsArray));
            console.log("______________________________________________________________________________________________________________________________________\n\n");

            // calculate economy 
            let econArray = [];
            let econObj;

            for (item of totalBallsAndRunsArray) {
                console.log("bowler: " + item._id + ", runs: " + item.runs + ", balls: " + item.balls);

                econObj = {
                    _id: item._id,
                    econ: item.runs / item.balls * 6
                };
                econArray.push(econObj);
            }

            //sort bowlers by economy
            econArray.sort(compareEcon);

            //retain only top ten bowlers
            let topTenEconArray = econArray.slice(0, 10);
             res.send(topTenEconArray);
        });
    });
}

// Story chart
function findMostPopularVenues(req, res) {

    MatchModel.aggregate([{
            $group: {
                _id: '$venue',

                matchesPlayed: {
                    "$sum": 1
                },
            }
        },

        {
            $sort: {
                matchesPlayed: -1
            }
        }
    ], function (err, items) {
        console.log(items);
        console.log(typeof items);
        let topTenVenues = items.slice(0, 9);

        res.send(topTenVenues);
    });
}

// home route
app.get("/", (req, res) => {
    console.log("home dir!");
    res.sendFile(path.join(__dirname + 'index.html'));
});

// get number of matches played per year array
app.get('/api/numberOfMatches', (req, res) => {

    // getJSONfromMatchesCSV();

    // clearMatchesDB();

    // populateMatchesDB();

    findNoOfMatchesPlayed(req, res);

})

// get number of matches played per year array
app.get('/api/stackedBarGraph', (req, res) => {

    findNoOfMatchesWon(req, res);

})

// get extra runs conceded per team in 2016
app.get('/api/extraRunsConceded', (req, res) => {

    console.log("hello 3!");
    findExtraRunsConceded(req, res);

})

// get extra runs conceded per team in 2016
app.get('/api/topEconomicalBowlers', (req, res) => {

    console.log("hello 4!");
    findTopEconomicalBowlers(req, res);

})

// most popular stadiums
app.get('/api/mostPopularVenues', (req, res) => {

    console.log("hello 5!");
    findMostPopularVenues(req, res);

})

app.listen(3000, () => console.log('listening on port 3000!'));