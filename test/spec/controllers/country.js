'use strict';
describe('Controller: CountryListCtrl', function () {

    // load the controller's module
    beforeEach(module('stadion'));
    var scope;
    var response = [
        {
            "name": "Spain",
            "gold": 4
        },
        {
            "name": "Italy",
            "gold": 3
        }
    ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $httpBackend.when('GET', 'https://api.mongolab.com/api/1/databases/stadion/collections/countries?apiKey=yjCay7qWRojHdBsbhp10CJegJRnzbkTJ').respond(response);
        scope = $rootScope.$new();
        var CountryListCtrl = $controller('CountryListCtrl', {
            $scope: scope
        });
        $httpBackend.flush();
    }));

    it('should attach a list of countries to the scope', function () {
        expect(scope.countries.length).toBe(2);
        expect(angular.equals(scope.countries, response)).toBe(true);

    });

    it('should set the default value of predicate and reverse model', function () {
        expect(scope.predicate.length).toBe(3);
        expect(scope.reverse).toBe('true');
    });
});
