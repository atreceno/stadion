/**
 * Defining the routes for countries
 */
var mongoose = require('mongoose');

var Country = mongoose.model('Country');

exports.findAll = function (req, res) {

    Country.find(function (err, data) {
        res.send(data);
    });

};

exports.findOne = function (req, res) {

    Country.findById(req.params.id, function (err, data) {
        res.send(data);
    });

};

exports.addNew = function (req, res) {

    var country = new Country(req.body);
    country.save(function (err) {
        res.send(err);
    });

};

exports.modify = function (req, res) {

    Country.findById(req.params.id, function (err, data) {
        data.name = req.body.name;
        data.gold = req.body.gold;
        data.silver = req.body.silver;
        data.bronze = req.body.bronze;
        data.save(function (err) {
            res.send(err);
        });
    });

};

exports.delete = function (req, res) {
    Country.findById(req.params.id, function (err, data) {
        data.remove(function (err) {
            res.send(err);
        });
    });
};