angular.module( 'app.controllers' )
.controller( 'PosterViewController', ['$scope', '$http', 'AppService', 'PosterViewService',
function($scope, $http, AS, PVS ){

  $scope.posters = PVS.posters;
}])
