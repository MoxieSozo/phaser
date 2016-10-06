angular.module( 'app.controllers' )
.controller( 'AppController', ['$scope', '$http', 'AppService',
function($scope, $http, AS){
  $scope.menu_open = false;

}])
