'use strict';

var stadion = angular.module('stadion');
stadion.controller('MainCtrl', function ($scope, $dialog, Feedback) {
    $scope.open = function () {
        $scope.shouldBeOpen = true;
        $scope.feedback = {name: '', email: '', message: ''};
    };
    $scope.close = function () {
        $scope.shouldBeOpen = false;
    };
    $scope.opts = {
        backdrop: true, 
        keyboard: true,
        backdropClick: true,
        dialogFade: true,
        backdropFade: true,
        templateUrl: 'partials/feedback.html',
        controller: 'DialogCtrl'
    };
    $scope.opts2 = {
        backdropFade: true, 
        dialogFade: true
    };
    $scope.send = function () {
        Feedback.save($scope.feedback, function () {
            console.log('Feedback sent successfully');
            $scope.shouldBeOpen = false;
        });
    };
    $scope.openFb = function () {
        $dialog.dialog($scope.opts).open().then(function(name) {
            alert(name);
        });
    };
});
stadion.controller('DialogCtrl', function ($scope, dialog) {
    $scope.closeFb = function (name) {
        dialog.close(name);
    };
    $scope.sendFb = function (data) {
        Feedback.save($scope.feedback, function () {
            console.log('Feedback sent successfully');
     //       $scope.shouldBeOpen = false;
        });
        dialog.close(data);
    };
});
stadion.controller('bmCtrl', function ($scope, Feedback) {
    $scope.send = function () {
        Feedback.save($scope.feedback, function () {
            console.log('Feedback sent successfully');
            $scope.isSent = true;
        });
    };
});

