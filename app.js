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

// find no of matches played each year--from matches database
function findNoOfMatchesPlayed(req, res) {

    var noOfMatches = [];
    for (let i = 2008; i <= 2017; i++) {
        MatchModel.count({
            season: i.toString()
        }, function (err, c) {
            if (err) {
                console.log("count error: " + err);
                return;
            }
            noOfMatches.splice(i - 2008, 0, c); // insert c at index i-2008, while deleting 0 items
            console.log("Number of matches played in " + i.toString() + " : " + c);
            console.log("Value in array for year" + i.toString() + " : " + noOfMatches[i - 2008]);
        });
    }
    // wait for the queries to finish
    setTimeout(function () {
        console.log("dis" + noOfMatches);
        res.send(noOfMatches);
    }, 1000);
}

// home route
app.get("/", (req, res) => {
    console.log("home dir!");
    res.sendFile(path.join(__dirname + 'index.html'));
});

// get number of matches played per year array
app.get('/api/numberOfMatches', (req, res) => {

    // getJSONfromCSV();

    // clearMatchesDB();

    // populateMatchesDB();

    findNoOfMatchesPlayed(req, res)

})

app.listen(3000, () => console.log('listening on port 3000!'))