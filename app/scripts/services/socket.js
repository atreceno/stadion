'use strict';

angular.module('stadion').factory('socket', function ($rootScope) {

    var socket = window.io.connect();

    return {
        on: function (event, callback) {
            socket.on(event, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (event, data, callback) {
            socket.emit(event, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
