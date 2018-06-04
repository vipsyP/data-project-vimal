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

// bring in model
let MatchModel = require('./models/match');

// project directory
app.use(express.static(__dirname + '/public'));

//get json file from csv file
function getJSONfromCSV() {

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

// find all unique years in the db
async function findSeasons(req, res) {

}

// find unique winners in the db
function findUniqueWinners(req, res) {

}

// find no of matches played each year--from matches database
function findNoOfMatchesPlayed(req, res) {
    console.log("Received request to /api/numberOfMatches");
    var noOfMatches = [];
    var noOfArrayItems = 0;

    let playedPromise = new Promise(function (resolve, reject) {
        for (let i = 2008; i <= 2017; i++) {
            MatchModel.count({
                season: i.toString()
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

//Used for sorting by _.id --examine this
function compare(a, b) {
    if (a._id < b._id)
        return -1;
    if (a._id > b._id)
        return 1;
    return 0;
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
        if (arrayItem.season.trim() != "")
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
    // console.log("does this work?: " + teamsResult);

    teamsResult.forEach(function (arrayItem) {
        //console.log("Teams item: " + arrayItem.winner);
        if (arrayItem.winner.trim() != "")
            teams.add(arrayItem.winner);
    });
    console.log("Teams length: " + teams.size);
    for (let team of teams) console.log(team);

    console.log("teams.size: " + teams.size);
    console.log("years.size: " + years.size);



    let forTheSeason = [];
    let i = 0;
    let teamsForTheYear;
    let missingTeamObject;


    for (let year of years) {


        MatchModel.aggregate([{
                $match: {
                    season: year,
                    result: "normal"
                }
            }, {
                $group: {
                    _id: '$winner',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ], function (err, result) {
            if (err) {
                console.log("error bro: " + err);
            } else {
                console.log("\n\nYear: " + year);
                result.forEach(function (element) {
                    console.log("" + element._id + " won " + element.count + " matches");
                });

                //insert teams who did not play during this season & set count to 0

                //array of teams that did play for this season
                teamsForTheYear = [];
                for (let item of result) {
                    teamsForTheYear.push(item._id);
                }
                console.log("teamsForTheYear: " + teamsForTheYear);

                // iterate through all the teams, and check who did not play this year
                for (let team of teams) {

                    // if this team did not play this year, add it to this year with count=0
                    if (teamsForTheYear.indexOf(team) == -1) {
                        console.log("year " + year + ", missing team: " + team);
                        missingTeamObject = {
                            _id: team,
                            count: 0
                        };
                        result.push(missingTeamObject);
                        console.log("new result: ");
                        for (resu of result) {
                            console.log(resu);
                        }
                        console.log("___________________________________________________");
                    }
                }
                console.log();
                console.log("*********************SORT IT***********************");
                console.log("___________________________________________________");
                console.log();
                //sort result objects by ._id
                result.sort(compare);
                for (resu of result) {
                    console.log(resu);
                }

                forTheSeason[year-2008] = result;

                if (i == Number(years.size) - 1) {
                    console.log("final i: " + i + ", year.size: " + years.size);

                    res.send(forTheSeason);

                }
                console.log("i: " + i + ", year.size: " + years.size);
                i++;
                console.log("this also");
            }
        });

    }



    // let wonByTeamsPromise = [];

    // var teamsMap = new Map();
    // var teamsKey;
    // var teamsValue;

    // var yearsMap = new Map();
    // var yearsKey;
    // var yearsValue;

    // let i = 0,
    //     j = 0;
    // let innerLoopBreak = false;


    // // for (let year of years) {

    // wonByTeamsPromise[i] = new Promise(function (resolve, reject) {

    //     innerLoop: for (let team of teams) {

    //         console.log("innerLoopBreak"+innerLoopBreak);

    //         if (innerLoopBreak == true) {
    //             console.log("broke");
    //             innerLoopBreak = false;
    //             break innerLoop;
    //         }

    //         MatchModel.count({
    //             season: 2008,
    //             winner: team

    //         }, function (err, c) {
    //             if (err) {
    //                 console.log("count error: " + err);
    //                 return;
    //             }

    //             teamsKey = team;
    //             teamsValue = c;
    //             teamsMap.set(teamsKey, teamsValue);

    //             console.log("Number of matches won by " + team + " in " + 2008 + " : " + c);
    //             console.log("i: " + i + ", j: " + j);

    //             if (j == 11) {
    //                 // break innerLoop;
    //                 innerLoopBreak = true;
    //                 console.log("\nfire in the hole");
    //                 resolve(teamsMap);
    //             }
    //             j++;
    //         }); // end of callback for async operation
    //     } // end of inner for
    // });


    // wonByTeamsPromise[i].then(function (result) {

    //     console.log("The result" + result + "end of result");
    //     j = 0;

    //     console.log("j1: " + j);
    //     for (var [key, value] of result) {
    //         console.log(key + ' = ' + value);
    //     }
    //     j = 0;
    //     i++;



    //     console.log("j1: " + j);
    //     console.log("i1: " + i);

    //     teamsMap = new Map();
    //     teamsKey = undefined;
    //     teamsValue = undefined;

    //     // noOfMatchesWon[i] = forTheSeason;
    //     // //noOfMatchesWon.splice(i++, 0, forTheSeason);
    //     // //console.log(noOfMatchesWon[i]);


    // });




    // } // end of outer for
    // setTimeout(function () {
    //     console.log("2D array: " + noOfMatchesWon);
    //     res.send(noOfMatchesWon);
    // }, 1000);
}


// home route
app.get("/", (req, res) => {
    console.log("home dir!");
    res.sendFile(path.join(__dirname + 'index.html'));
});

// get number of matches played per year array
// app.get('/api/uniqueYears', (req, res) => {

//     findUniqueWinners(req, res);

// })


// get number of matches played per year array
app.get('/api/numberOfMatches', (req, res) => {

    // getJSONfromCSV();

    // clearMatchesDB();

    // populateMatchesDB();

    findNoOfMatchesPlayed(req, res);

})

// get number of matches played per year array
app.get('/api/stackedBarGraph', (req, res) => {

    // getJSONfromCSV();

    // clearMatchesDB();

    // populateMatchesDB();

    findNoOfMatchesWon(req, res);

})

app.listen(3000, () => console.log('listening on port 3000!'));