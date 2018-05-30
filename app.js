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

    let fileInputName = 'csv/matches.csv';
    let fileOutputName = 'json/matches.json';

    csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName, fileOutputName);

    fs.readFile('json/matches.json', function (err, data) {
        if (err) {
            console.log("read file error: " + err);
            return;
        }
        console.log("Type of data: " + typeof data.toString());
        res.send(data.toString());
        // documents
        //let matchDocuments = new MatchModel(data);
        // matchDocuments.save(); 
        
        // delete all documents
        MatchModel.deleteMany({}, function (error) {
            if (err) {
                console.log("delete many error: " + err);
                return;
            }
            console.log("deleted many");
        });
        
        // insert all documents
        MatchModel.insertMany(JSON.parse(data.toString()), function (error, docs) {
            if (err) {
                console.log("insert many error: " + err);
                return;
            }
            console.log("inserted many");
        });

        
    });


})

app.listen(3000, () => console.log('listening on port 3000!'))