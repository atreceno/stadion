'use strict';

describe('stMedal directive', function () {

    var element;
    var scope;

    // Load the module
    beforeEach(module('stadion'));

    // Inject and compile the st-medal element
    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope;
        element = angular.element('<div data-st-medal="" data="countries" sort="sort" />');
        $compile(element)($rootScope);
    }));

    it('should add a class attribute to the <div> element', function() {
        expect(element.hasClass('ng-isolate-scope')).toBe(true);
        expect(element.hasClass('ng-scope')).toBe(true);
    });

    it('should leave the rest of the attributes in the <div> element', function() {
        expect(element.attr('data-st-medal')).toBe('');
        expect(element.attr('data')).toBe('countries');
        expect(element.attr('sort')).toBe('sort');
    });

    it('should append an <svg> element inside the <div> element', function() {
        expect(element.find('svg').attr('preserveAspectRatio')).toBe('xMinYMin meet');
        expect(element.find('svg').attr('viewBox')).toBe('0 0 700 350');
        expect(element.find('g').attr('transform')).toBe('translate(40,20)');
    });

});
