'use strict';

angular.module('stadionApp', ['ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/medal', {
        templateUrl: 'views/medal.html',
        controller: 'MedalCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
