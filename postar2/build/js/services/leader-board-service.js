angular.module( 'app.services')
.service( 'LeaderBoardService', ['$firebaseArray', function($firebaseArray){

  var $service =  {
    get_leaders : function(){
    	var leadersRef = firebase.database().ref().child('postar_leaders');
    	var postar_leaders = $firebaseArray(leadersRef);
    }
  }

	$service.leadersRef = firebase.database().ref().child('postar_leaders');
  $service.leaders = $firebaseArray($service.leadersRef);

  return $service
}])
