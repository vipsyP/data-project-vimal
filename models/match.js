const mongoose = require('mongoose');

var MatchSchema = mongoose.Schema({
  // year: String    // change type to date?
  id: String,
  season: Number,
  city: String,
  date: String,
  team1: String,
  team2: String,
  toss_winner: String,
  toss_decision: String,
  result: String,
  dl_applied: String,
  winner: String,
  win_by_runs: String,
  win_by_wickets: String,
  player_of_match: String,
  venue: String,
  umpire1: String,
  umpire2: String,
  umpire3: String
});

module.exports = mongoose.model('Match', MatchSchema, 'matches');