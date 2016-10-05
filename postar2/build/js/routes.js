angular.module( 'postar')
.config(function($stateProvider, $urlRouterProvider) {
 $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'templates/index.html',
      controller : 'AppController'
    });

    $urlRouterProvider.otherwise('/');
})

