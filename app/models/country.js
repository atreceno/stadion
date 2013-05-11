/**
 * Defining the model for countries
 */
var mongoose = require('mongoose');

var countrySchema = mongoose.Schema({
    name: {type: String, required: true },
    gold: { type: Number, min: 0, max: 100 },
    silver: { type: Number, min: 0, max: 100 },
    bronze: { type: Number, min: 0, max: 100 }
}, {collection: 'countries'});

var Country = mongoose.model('Country', countrySchema);
