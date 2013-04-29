'use strict';

angular.module('stadionApp')
  .controller('MedalCtrl', function ($scope) {
    $scope.countries = [
      {'name': 'United States of America', 'gold': 46, 'silver': 29, 'bronze':29, 'anotherField': 'USA'},
      {'name': 'People\'s Republic of China', 'gold': 38, 'silver': 27, 'bronze':23, 'anotherField': 'PRC'},
      {'name': 'Great Britain', 'gold': 29, 'silver': 17, 'bronze':19, 'anotherField': 'GB'},
    ];
    $scope.query = '';
    $scope.predicate = ['gold', 'silver', 'bronze'];
    $scope.reverse = 'true';
  });
  