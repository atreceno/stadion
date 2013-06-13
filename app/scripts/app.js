'use strict';

angular.module('stadion', ['mongoLabApi','ui.bootstrap'])
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
            .when('/tournaments/search/:tournamentName', {
                templateUrl: 'partials/tournament-list.html',
                controller: 'TournamentListCtrl'
            })
            .when('/tournaments/view/:tournamentId', {
                templateUrl: 'partials/tournament-view.html',
                controller: 'TournamentViewCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
