'use strict';
var fiddle = angular.module('fiddle', []);
//fiddle.config(function ($routeProvider) {
//    $routeProvider
//        .when('/', {templateUrl: 'partials/fiddle.html', controller: 'fiddleCtrl'})
//        .otherwise({redirectTo: '/'});
//});
fiddle.factory('Widgets', function ($http, $q) {
    return {
        // Count with callback in case of success
        countWithCallback: function (cb) {
            $http({
                method: 'GET',
                url: 'https://api.mongolab.com/api/1/databases/stadion/collections/sports',
                params: {apiKey: 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ', c: true}
            }).success(cb);
        },
        // Count returning the $http service
        countWithReturn: function () {
            return $http({
                method: 'GET',
                url: 'https://api.mongolab.com/api/1/databases/stadion/collections/sports',
                params: {apiKey: 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ', c: true}
            });
        },
        // Count with promises
        countWithPromise: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://api.mongolab.com/api/1/databases/stadion/collections/sports',
                params: {apiKey: 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ', c: true}
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject();
            });
            return deferred.promise;
        },
        countWithThen: function () {
            return $http({
                method: 'GET',
                url: 'https://api.mongolab.com/api/1/databases/stadion/collections/sports',
                params: {apiKey: 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ', c: true}
            }).then(function (resp) {
                return resp.data;
            });
        }
    };
});
fiddle.controller('fiddleCtrl', function ($scope, Widgets) {
    Widgets.countWithCallback(function (data, status) {
        $scope.countCallback = data;
        console.log('countCallback: ', data);
        console.log('status: ', status);
    });
    $scope.countReturn = Widgets.countWithReturn();
    $scope.countReturn2 = Widgets.countWithReturn().success(function (data) {
        console.log('countReturn2: ', data);
    }).error(function (data, status, header, config) {
        console.error(data, status, header, config);
    });
    $scope.countPromise = Widgets.countWithPromise();
    Widgets.countWithPromise().then(function (data) {
        console.log('countWithPromise: ', data);
    });
    Widgets.countWithThen().then(function (data) {
        console.log('countWithThen: ', data);
        $scope.countThen = data;
    });
    var extendMe = function (dst) {
        angular.forEach(arguments, function (obj) {
            if (obj !== dst) {
                angular.forEach(obj, function (val, key) {
                    dst[key] = val;
                });
            }
        });
        return dst;
    };
    var allItems = {};
    var item1 = {name:'shoes', brand:{name: 'Nike'}};
    var item2 = {some:'gloves', foo:{name: 'Zara'}};
    for (var key in item2) {
        if (item2.hasOwnProperty(key)) {
            console.log(key);
        }
    }
    var some = extendMe(allItems, item1, item2);
    console.log(allItems);
    console.log(some);
    item1.brand.name = 'Other';

});
fiddle.controller('someCtrl', function($scope) {
    $scope.message = 'aaaa';
    setTimeout(function () {
        $scope.$apply(function () {
            $scope.message = 'bbbb';
            console.log('timeout');
        });
    }, 2000);
});
