'use strict';

angular.module('stadion').directive('stMedal', function () {
    return {
        template: '<div></div>',
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            element.text('this is the stMedal directive');
        }
    };
});
