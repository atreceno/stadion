'use strict';

var stadion = angular.module('stadion');

stadion.controller('TournamentListCtrl', function ($scope, $routeParams, $location, Tournament, Sport) {

    $scope.tName = $routeParams.tournamentName;
    $scope.tSport = $routeParams.sport;
    $scope.tLocation = $routeParams.location;
    $scope.predicates = ['name', 'location', 'sport'];
    $scope.itemsPerPage = [25, 50, 100];
    $scope.sports = Sport.query({f:JSON.stringify({_id:0,name:1})});
    $scope.locations = ['London, UK'];

    // Default values
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.sortBy = 'name';
    $scope.pageSize = 25;

    var getQueryParams = function (name, sport, loc, count, predicate, currentPage, itemPerPage) {
        var res = {};
        if (name || sport || loc) {
            var q = {};
            if (name) {
                q.name = {$regex: name, $options: 'i'};
            }
            if (sport) {
                q.sport = sport;
            }
            if (loc) {
                q.location = loc;
            }
            res.q = JSON.stringify(q);
        }
        if (count) {
            res.c = true;
        } else {
            res.f = JSON.stringify({name: 1, description: 1, location: 1, sport: 1});
            var s = {};
            s[predicate] = 1;
            res.s = JSON.stringify(s);
            res.sk = itemPerPage * (currentPage - 1);
            res.l = itemPerPage;
        }
        return res;
    };

    $scope.search = function (predicate, itemPerPage) {
        $scope.count = Tournament.count(getQueryParams($scope.tName, $scope.tSport, $scope.tLocation, true)).success(function (data) {
            $scope.noOfPages = Math.ceil(data / $scope.pageSize);
        });
        $scope.sortBy = predicate;
        $scope.pageSize = itemPerPage;
        var params = getQueryParams($scope.tName, $scope.tSport, $scope.tLocation, false, predicate, $scope.currentPage, itemPerPage);
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
