angular.module( 'app.services')
.service( 'PosterViewService', [function(){

  var $service = {
    get_posters  : function(){
      return [
        {'year' : '2011', 'name' : 'Blah', 'src' : '2011.png'},
        {'year' : '2012', 'name' : 'Blah', 'src' : '2012.png'},
        {'year' : '2013', 'name' : 'Blah', 'src' : '2013.png'}
      ]
    },

  }

  $service.posters = $service.get_posters();


  return $service;

}])
