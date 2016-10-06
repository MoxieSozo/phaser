angular.module( 'app.controllers' )
.controller( 'LeaderBoardController', ['$scope', '$http', 'AppService', 'LeaderBoardService',
function($scope, $http, AS, LBS){

  $scope.leaders = LBS.leaders;

}])
