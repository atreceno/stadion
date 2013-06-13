'use strict';

var stadion = angular.module('stadion');

stadion.controller('TournamentListCtrl', function ($scope, $routeParams, $http, Tournament) {
    
    $scope.searchName = $routeParams.tournamentName;
    $scope.predicates = ['name', 'location', 'sport'];
    $scope.itemsPerPage = [25, 50, 100];
    $scope.currentPage = 1; 
    $scope.selected = $routeParams.sport;
    $scope.sports = ['Archery', 'Cycling BMX', 'Boxing'];
    $scope.selectedLocation = $routeParams.location;
    
    // Default values
    $scope.maxSize = 5;
    $scope.sortBy = 'name';
    $scope.pageSize = 25;

    var getQueryParams = function (name, sport, count, predicate, currentPage, itemPerPage) {
        var res = new Object();
        if (name || sport) {
            var q = new Object();
            if (name) {
                q['name'] = {$regex: name, $options: 'i'};
            }
            if (sport) {
                q['sport'] = sport;
            }
            res['q'] = JSON.stringify(q);
        }
        if (count) {
            res['c'] = true;
        } else {
            res['f'] = JSON.stringify({name: 1, description: 1, location: 1, sport: 1});
            var s = new Object();
            s[predicate] = 1;
            res['s'] = JSON.stringify(s);
            res['sk'] = itemPerPage * (currentPage - 1);
            res['l'] = itemPerPage;
        }
        return res;
    };

    $scope.search = function (predicate, itemPerPage) {
        $scope.count = Tournament.count(getQueryParams($scope.searchName, $scope.selected, true)).success(function (data) {
            $scope.noOfPages = Math.ceil(data / $scope.pageSize);
        });
        $scope.sortBy = predicate;
        $scope.pageSize = itemPerPage;
        var params = getQueryParams($scope.searchName, $scope.selected, false, predicate, $scope.currentPage, itemPerPage);
        $scope.tournaments = Tournament.query(params);
    };
    
    $scope.$watch('currentPage', function () {
        $scope.search($scope.sortBy, $scope.pageSize);
    });

});
stadion.controller('TournamentViewCtrl', function ($scope, $routeParams, Tournament) {

    var self = this;
    Tournament.get({
        id: $routeParams.tournamentId
    }, function (tournament) {
        self.original = tournament;
        $scope.tournament = new Tournament(self.original);
    });

    $scope.panes = [{name: 'asdf', content: 'aaaa'},{name: 'fafa', content: 'ffff'}];

});
