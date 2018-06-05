const mongoose = require('mongoose');

var DeliverySchema = mongoose.Schema({
    match_id: String,
    inning: String,
    batting_team: String,
    bowling_team: String,
    over: String,
    ball: String,
    batsman: String,
    non_striker: String,
    bowler: String,
    is_super_over: String,
    wide_runs: String,
    bye_runs: String,
    legbye_runs: String,
    noball_runs: String,
    penalty_runs: String,
    batsman_runs: String,
    extra_runs: String,
    total_runs: String,
    player_dismissed: String,
    dismissal_kind: String,
    fielder: String
});

module.exports = mongoose.model('Delivery', DeliverySchema, 'deliveries');