'use strict';

describe('Controller: TournamentListCtrl', function () {

    // load the controller's module
    beforeEach(module('stadion'));

    var scope;
    var response = ['Archery', 'Boxing', 'Diving'];
    var numOfTourn = 13;
    var tournaments = ['Diving 50m', 'Pistol 100m'];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $httpBackend.when('GET', 'https://api.mongolab.com/api/1/databases/stadion/collections/sports?apiKey=yjCay7qWRojHdBsbhp10CJegJRnzbkTJ&f=%7B%22_id%22:0,%22name%22:1%7D').respond(response);
        $httpBackend.when('GET', 'https://api.mongolab.com/api/1/databases/stadion/collections/tournaments?apiKey=yjCay7qWRojHdBsbhp10CJegJRnzbkTJ&c=true').respond(numOfTourn);
        $httpBackend.when('GET', 'https://api.mongolab.com/api/1/databases/stadion/collections/tournaments?apiKey=yjCay7qWRojHdBsbhp10CJegJRnzbkTJ&f=%7B%22name%22:1,%22description%22:1,%22location%22:1,%22sport%22:1%7D&l=25&s=%7B%22name%22:1%7D&sk=0').respond(numOfTourn);
        scope = $rootScope.$new();
        var TournamentListCtrl = $controller('TournamentListCtrl', {
            $scope: scope
        });
        $httpBackend.flush();
    }));

    it('should attach a list of sports to the scope', function () {
        expect(scope.sports.length).toBe(3);
        //expect(angular.equals(scope.sports, response)).toBe(true);
    });

    it('should attach a list of predicates to the scope', function () {
        expect(scope.predicates.length).toBe(3);
    });
});
