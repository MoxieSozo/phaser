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
    if($service.leaders.length  > 0 ){
      $service.getHighScore();
      if(score > $service.leaders[0].score){
        return true;
      }
    } else{
      return true;
    }
  }

  $service.getHighScore = function(){
    if($service.leaders.length  > 0 ){
      $service.leaders.sort( function($a , $b ){
        return $b.score - $a.score;
      })
    }
  }


  $service.saveScore = function( name , score){
    return  $service.leaders.$add({ name: name , score : score });

  }


  return $service
}])
