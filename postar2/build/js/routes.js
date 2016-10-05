angular.module( 'postar')
.config(function($stateProvider, $urlRouterProvider) {
 $stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'templates/index.html',
    })
    .state( 'game', {
      url : '/game',
      templateUrl : 'templates/game.html',
      controller : 'GameController'
    })
    .state( 'leader-board', {
      url : '/leader-board',
      templateUrl : 'templates/leader-board.html',
      controller : 'LeaderBoardController'
    })
    .state( 'poster-view', {
      url : '/poster-view',
      templateUrl : 'templates/poster-view.html',
      controller : 'PosterViewController'
    })
    ;

    $urlRouterProvider.otherwise('/');
})

