'use strict';

describe('TournamentListCtrl controller', function () {

    var scope;
    var sports = [{name:'Archery'},{name:'Athletics'},{name:'Badminton'}];
    var numOfTourn = 13;
    var tournaments = [ { 'name' : '10m Air Pistol Men' , 'sport' : 'Shooting' , 'description' : 'Dominus Quixotus' , 'location' : 'London, UK'}, { 'name' : '10m Air Pistol Women' , 'sport' : 'Shooting' , 'description' : 'Dominus Quixotus' , 'location' : 'London, UK'} ];
    var mongolabBaseUrl = 'https://api.mongolab.com/api/1/databases/stadion/collections';
    var mongolabApiKey = 'yjCay7qWRojHdBsbhp10CJegJRnzbkTJ';
    
    // Load the module
    beforeEach(angular.mock.module('stadion'));

    // Initialize the controller and inject a new scope
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $httpBackend) {
        $httpBackend.when('GET', mongolabBaseUrl + '/sports?apiKey=' + mongolabApiKey + '&f=%7B%22_id%22:0,%22name%22:1%7D').respond(sports);
        $httpBackend.when('GET', mongolabBaseUrl + '/tournaments?apiKey=' + mongolabApiKey + '&c=true').respond(numOfTourn);
        $httpBackend.when('GET', mongolabBaseUrl + '/tournaments?apiKey=' + mongolabApiKey + '&f=%7B%22name%22:1,%22description%22:1,%22location%22:1,%22sport%22:1%7D&l=25&s=%7B%22name%22:1%7D&sk=0').respond(tournaments);
        scope = $rootScope.$new();
        $controller('TournamentListCtrl', {$scope: scope});
        $httpBackend.flush();
    }));

    it('should allow you to order by name, location or sport', function() {
        expect(scope.predicates.length).toBe(3);
        expect(scope.predicates[0]).toBe('name');
        expect(scope.predicates).toEqual(['name', 'location', 'sport']);
    });

    it('should allow you to change the page size', function() {
        expect(scope.itemsPerPage.length).toBe(3);
        expect(scope.itemsPerPage[0]).toBe(25);
        expect(scope.itemsPerPage).toEqual([25, 50, 100]);
    });

    it('should allow you to filter by location', function() {
        expect(scope.locations.length).toBeGreaterThan(1);
        expect(scope.locations).toContain('London, UK');
    });

    it('should attach a list of sports to the scope', function () {
        expect(scope.sports.length).toBe(3);
        expect(scope.sports[0].name).toBe('Archery');
        expect(scope.sports[1].name).toBe('Athletics');
        expect(scope.sports[2].name).toBe('Badminton');
    });

    it('should attach a list of tournaments to the scope', function() {
        expect(scope.tournaments.length).toBe(2);
        expect(scope.tournaments[0].name).toBe(tournaments[0].name);
        expect(scope.tournaments[0].sport).toBe(tournaments[0].sport);
        expect(scope.tournaments[0].description).toBe(tournaments[0].description);
        expect(scope.tournaments[0].location).toBe(tournaments[0].location);
        expect(scope.tournaments[1].name).toBe(tournaments[1].name);
        expect(scope.tournaments[1].sport).toBe(tournaments[1].sport);
        expect(scope.tournaments[1].description).toBe(tournaments[1].description);
        expect(scope.tournaments[1].location).toBe(tournaments[1].location);
    });

});
