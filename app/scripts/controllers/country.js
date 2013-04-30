'use strict';

var stadion = angular.module('stadion');

stadion.controller('CountryListCtrl', function ($scope, Country) {
    $scope.countries = Country.query();
    $scope.query = '';
    $scope.predicate = ['gold', 'silver', 'bronze'];
    $scope.reverse = 'true';
});

stadion.controller('CountryEditCtrl', function ($scope, $location, $routeParams, Country) {
    var self = this;

    Country.get({
        id: $routeParams.countryId
    }, function (country) {
        self.original = country;
        $scope.country = new Country(self.original);
    });

    $scope.isClean = function () {
        return angular.equals(self.original, $scope.country);
    }

    $scope.destroy = function () {
        self.original.destroy(function () {
            $location.path('/countries');
        });
    };

    $scope.save = function () {
        $scope.country.update(function () {
            $location.path('/countries');
        });
    };
});

stadion.controller('CountryNewCtrl', function ($scope, $location, Country) {
    $scope.save = function () {
        Country.save($scope.country, function (country) {
            $location.path('/countries');
        });
    };
});
