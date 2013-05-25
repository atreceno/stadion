'use strict';

angular.module('stadion', ['mongoLabApi'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            })
            .when('/countries', {
                templateUrl: 'partials/country-list.html',
                controller: 'CountryListCtrl'
            })
            .when('/countries/edit/:countryId', {
                templateUrl: 'partials/country-detail.html',
                controller: 'CountryEditCtrl'
            })
            .when('/countries/new', {
                templateUrl: 'partials/country-detail.html',
                controller: 'CountryNewCtrl'
            })
            .when('/tournaments', {
                templateUrl: 'views/partials/tournament-list.html',
                controller: 'TournamentListCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
