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

app.get('/', (req, res) => {

    // let fileInputName = 'csv/matches.csv';
    // let fileOutputName = 'json/matches.json';
    //csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName, fileOutputName);

    // delete all documents
    // MatchModel.deleteMany({}, function (error) {
    //     if (error) {
    //         console.log("delete many error: " + error);
    //         return;
    //     }
    //     console.log("deleted many");
    // });

    fs.readFile('json/matches.json', function (err, data) {
        if (err) {
            console.log("read file error: " + err);
            return;
        }
        res.send(data.toString());

        // insert all documents
        //     MatchModel.insertMany(JSON.parse(data), function (error, docs) {
        //         if (err) {
        //             console.log("insert many error: " + err);
        //             return;
        //         }
        //         console.log("inserted many");
        //     });
    });

    let noOfMatches = [];
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
    setTimeout(function () {
        console.log("dis" + noOfMatches);
    }, 5000);

    res.send(noOfMatches);
})

app.listen(3000, () => console.log('listening on port 3000!'))