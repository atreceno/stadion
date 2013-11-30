/**
 * Defining the routes for tournaments
 */
var mongoose = require('mongoose');
var eyes = require('eyes');

var Tournament = mongoose.model('Tournament');

exports.findAll = function (req, res) {
    Tournament.find(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
};

exports.findOne = function (req, res) {
    Tournament.findById(req.params.id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
};

exports.addNew = function (req, res) {
    var tournament = new Tournament(req.body);
    tournament.save(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
};

exports.modify = function (req, res) {
    Tournament.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
};

exports.delete = function (req, res) {
    Tournament.findById(req.params.id, function (err, data) {
        data.remove(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    });
};

