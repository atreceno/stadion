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
mongoLabApi.factory('Tournament', function ($resource, $http) {

    var url = 'https://api.mongolab.com/api/1/databases/stadion/collections/tournaments/:id';
    var Tournament = $resource(url, {
        'apiKey': 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Tournament.count = function (params) {
        var config = {};
        config.method = 'GET';
        config.url = 'https://api.mongolab.com/api/1/databases/stadion/collections/tournaments';
        params.apiKey = 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ';
        config.params = params;
        return $http(config);
    };

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
mongoLabApi.factory('Sport', function ($resource) {


    var Sport = $resource('https://api.mongolab.com/api/1/databases/stadion/collections/sports/:id', {
        'apiKey': 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ'
    }, {
        update: {
            method: 'PUT'
        }
    });
    return Sport;

});
mongoLabApi.factory('Feedback', function ($resource) {

    var Feedback = $resource('https://api.mongolab.com/api/1/databases/stadion/collections/feedbacks/:id', {
        'apiKey': 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Feedback.prototype.update = function (cb) {
        return Feedback.update({
            id: this._id.$oid
        }, angular.extend({}, this, {
            _id: undefined
        }), cb);
    };

    return Feedback;

});
