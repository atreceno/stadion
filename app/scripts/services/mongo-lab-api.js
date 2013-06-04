'use strict';

var mongoLabApi = angular.module('mongoLabApi', ['ngResource']);

mongoLabApi.factory('Country', function ($resource) {

    var Country = $resource('https://api.mongolab.com/api/1/databases/stadion/collections/countries/:id', {
        'apiKey': 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Country.prototype.update = function (cb) {
        return Country.update({
            id: this._id.$oid
        }, angular.extend({}, this, {
            _id: undefined
        }), cb);
    };

    Country.prototype.destroy = function (cb) {
        return Country.remove({
            id: this._id.$oid
        }, cb);
    };

    return Country;

});

mongoLabApi.factory('Tournament', function ($resource) {

    var Tournament = $resource('https://api.mongolab.com/api/1/databases/stadion/collections/tournaments/:id', {
        'apiKey': 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Tournament.prototype.update = function (cb) {
        return Tournament.update({
            id: this._id.$oid
        }, angular.extend({}, this, {
            _id: undefined
        }), cb);
    };

    Tournament.prototype.destroy = function (cb) {
        return Tournament.remove({
            id: this._id.$oid
        }, cb);
    };

    return Tournament;

});
