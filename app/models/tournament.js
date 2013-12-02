/**
 * Tournamet model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fixture = Schema({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    date: {type: Date, requred: false}
}, {_id: false});

var Phase = Schema({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    fixtures: {type: [Fixture], required: false}
}, {_id: false});

var Competitor = Schema({
    seed: {type: String, required: true}, 
    name: {type: String, required: true},
    result: {type: Number, required: false}
}, {_id: false});

var tournamentSchema = Schema({
    sport: {type: String, required: true},
    code: {type: String, required: false},
    name: {type: String, required: true},
    description: {type: String, required: false},
    location: {type: String, required: false},
    startDate: {type: String, required: false},
    competitors: {type: [Competitor], required: false},
    phases: {type: [Phase], required: false}
}, {collection: 'tournaments'});

var Tournament = mongoose.model('Tournament', tournamentSchema);
