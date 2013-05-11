/**
 * Defining the model for sports
 */
var mongoose = require('mongoose');

var sportSchema = mongoose.Schema({
    name: {type: String, required: true },
    description: {type: String, required: false }
}, {collection: 'sport'});

var Sport = mongoose.model('Sport', sportSchema);