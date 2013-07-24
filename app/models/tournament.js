/*
 * Tournamets model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tournamentSchema = Schema({
    sport: {type: String, required: true},
    code: {type: String, required: false},
    name: {type: String, required: true},
    description: {type: String, required: false},
    location: {type: String, required: false},
    startDate: {type: String, required: false}
}, {collection: 'tournaments'});

var Tournament = mongoose.model('Tournament', tournamentSchema);
