const mongoose = require('mongoose');

var YearOfMatchSchema = mongoose.Schema({
    year: String    // change type to date?
  });

module.exports = mongoose.model('YearOfMatch', YearOfMatchSchema, 'yearsofmatches');
