/**
 * Created with JetBrains WebStorm.
 * User: atreceno
 * Date: 04/05/2013
 * Time: 19:52
 * To change this template use File | Settings | File Templates.
 */
'use strict';

angular.module('localRestApi', ['ngResource']).factory('Country', function ($resource) {

    var Country = $resource('/api/countries/:id', {}, {update: {method: 'PUT'}});

    Country.prototype.update = function (cb) {
        return Country.update({
            id: this._id
        }, angular.extend({}, this, {
            _id: undefined
        }), cb);
    };

    Country.prototype.destroy = function (cb) {
        return Country.remove({
            id: this._id
        }, cb);
    };

    return Country;

});