'use strict';

angular.module('mongoLabApi', ['ngResource'])
    .factory('Country', function ($resource) {

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
