'use strict';

angular.module('stadion', ['mongolab'])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main.html',
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
