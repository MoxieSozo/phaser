angular.module( 'app.services')
.service( 'LeaderBoardService', ['$firebaseArray', function($firebaseArray){

  var $service =  { }


	$service.leadersRef = firebase.database().ref().child('postar_leaders');
  $service.leaders = $firebaseArray($service.leadersRef);


  $service.leaders.$loaded().then(function(x) {
    $service.getHighScore();
  })

  $service.leaders.$watch(function($a, $b){
    $service.getHighScore();
  })

  $service.checkHighScore = function( score ){
    console.log( score )
    $service.getHighScore();
    if(score > $service.leaders[0].score){
      return true;
    }
  }

  $service.getHighScore = function(){
    $service.leaders.sort( function($a , $b ){
      return $b.score - $a.score;
    })
    console.log( $service.leaders[0].score)
  }


  $service.saveScore = function( name , score){
    $service.leaders.$add({ name: name , score : score }).then(function(ref) {
      alert( 'Score Added')
    });

  }


  return $service
}])
