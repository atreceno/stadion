'use strict';

describe('Controller: MedalCtrl', function () {

  // load the controller's module
  beforeEach(module('stadionApp'));

  var MedalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MedalCtrl = $controller('MedalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of countries to the scope', function () {
    expect(scope.countries.length).toBe(3);
  });
  
  it('should set the default value of predicate and reverse model', function() {
    expect(scope.predicate.length).toBe(3);
    expect(scope.reverse).toBe('true');
  });
});
