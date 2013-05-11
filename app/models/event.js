/**
 * Defining the model for events
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    venue: { type: String, required: false },
    location: { type: String, required: false },
    rules: { type: String, required: false },
    modified: { type: Date, default: Date.now },
    ranking: [
        { name: String, ranking: Number }
    ],
    sport: { type: Schema.ObjectId, ref: 'Sport'},
    ties: [
        {name: String, phase: String, start: Date}
    ]
}, {collection: 'event'});

// Add instance methods [http://mongoosejs.com/docs/guide.html#methods]
eventSchema.methods.findWithSameLocation = function (cb) {
    return this.model('Event').find({ location: this.location }, cb);
};

// Add static constructor methods [http://mongoosejs.com/docs/guide.html#statics]
eventSchema.statics.findByName = function (name, cb) {
    this.find({name: new RegExp(name, 'i')}, cb);
};

var Event = mongoose.model('Event', eventSchema);