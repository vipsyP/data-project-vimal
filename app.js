const express = require('express')
const app = express()
const csvToJson = require('convert-csv-to-json');

app.get('/', (req, res) => {

    let fileInputName = 'csv/matches.csv'; 
    let fileOutputName = 'json/matches.json';
     
    csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
    res.send('Hello World!')

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))