'use strict';

angular.module('stadion', ['localRestApi'])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/main',
            controller: 'MainCtrl'
        })
            .when('/countries', {
                templateUrl: 'views/country/list.html',
                controller: 'CountryListCtrl'
            })
            .when('/countries/edit/:countryId', {
                templateUrl: 'views/country/detail.html',
                controller: 'CountryEditCtrl'
            })
            .when('/countries/new', {
                templateUrl: 'views/country/detail.html',
                controller: 'CountryNewCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
