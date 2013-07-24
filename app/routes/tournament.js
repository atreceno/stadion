/**
 * Defining the routes for countries
 */
var mongoose = require('mongoose');

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
/*
exports.findOne = function (req, res) {

    Country.findById(req.params.id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });

};

exports.addNew = function (req, res) {

    var country = new Country(req.body);
    country.save(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });

};

exports.modify = function (req, res) {

    var country = new Country(req.body);
    country.save(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });

};

exports.delete = function (req, res) {
    Country.findById(req.params.id, function (err, data) {
        data.remove(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        });
    });
};
*/

