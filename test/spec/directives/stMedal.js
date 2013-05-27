'use strict';

describe('Directive: stMedal', function () {
    beforeEach(module('stadion'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<st-medal></st-medal>');
        element = $compile(element)($rootScope);
        expect(element.text()).toBe('this is the stMedal directive');
    }));
});
