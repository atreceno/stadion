'use strict';

angular.module('stadion')
    .controller('MainCtrl', function ($scope, Feedback) {
        $scope.open = function () {
            $scope.shouldBeOpen = true;
            $scope.feedback = {name: '', email: '', message: ''};
        };
        $scope.close = function () {
            $scope.shouldBeOpen = false;
        };
        $scope.opts = {
            backdropFade: true, 
            dialogFade: true
        };
        $scope.send = function () {
            Feedback.save($scope.feedback, function () {
                console.log('Feedback sent successfully');
                $scope.shouldBeOpen = false;
            });
        };
    });
