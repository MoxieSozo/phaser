// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('postar', ['ionic', 'app.controllers', 'app.services', 'firebase'])

.run(function($ionicPlatform) {

  firebase.initializeApp({
    apiKey: "AIzaSyAWMNtJ6BVc7XR1BRWUMzU4yPVCittoyqE",
    authDomain: "project-2372542451830160777.firebaseapp.com",
    databaseURL: "https://project-2372542451830160777.firebaseio.com",
    storageBucket: "project-2372542451830160777.appspot.com",
  });

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


angular.module( 'app.controllers', []);
angular.module( 'app.services', []);

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


angular.module( 'app.services')
.service('AppService', [function(){

}]);

angular.module( 'app.services')
.service( 'GameService', [function(){


  var IS =  {
    // boot the preloader bar
    Boot  : {
      preload: function() {
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
      },
      create: function() {
        this.game.stage.backgroundColor = '#000000';
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('Preload');
      }
    },
    // boot the Preload Bar
    Preload : {
      preload: function() {
        //show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(3);

        this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        this.load.spritesheet('hunter', 'assets/images/astronaut.sprite.png', 50,50);
        //this.load.spritesheet('playerScratch', 'assets/images/dog_scratch.png', 116, 100, 2);
        //this.load.spritesheet('playerDig', 'assets/images/dog_dig.png', 129, 100, 2);
        this.load.spritesheet('buttons', 	'assets/images/buttons.png', 32, 32);
        this.load.spritesheet('hop', 'assets/images/hop.png', 32, 32, 6);
        this.load.image('background', 'assets/images/background.png');
        this.load.image('cloud1', 'assets/images/cloud-1.png');
        this.load.image('cloud2', 'assets/images/cloud-2.png');
        this.load.image('cloud3', 'assets/images/cloud-3.png');
        this.load.image('cloud4', 'assets/images/cloud-4.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('pint', 'assets/images/pint.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('grass', 'assets/images/grass.png');
        this.load.image('castle', 'assets/images/castle.png');
        this.load.audio('damage', ['assets/audio/whine.ogg', 'assets/audio/whine.mp3']);


        this.load.audio('blip', ['assets/audio/blip.wav']);
        this.load.audio('explosion', ['assets/audio/explosion.wav']);
        this.load.audio('fail', [ 'assets/audio/fail.wav']);
        this.load.audio('game-over', [ 'assets/audio/fail.wav']);
        this.load.audio('hurt', [ 'assets/audio/hurt.wav']);
        this.load.audio('jump', [ 'assets/audio/jump.wav']);
        this.load.audio('lazer', [ 'assets/audio/lazer.wav']);
        this.load.audio('life', [ 'assets/audio/life.wav']);
        this.load.audio('level-up', [ 'assets/audio/level-up.wav']);
        this.load.audio('soundtrack', [ 'assets/audio/soundtrack.wav']);
        this.load.audio('toss', [ 'assets/audio/toss.wav']);



        //this.load.audio('bark', ['assets/audio/bark.ogg', 'assets/audio/bark.mp3']);

        //this.load.image('mound', 'assets/images/rock.png');

        this.load.image('alien', 'assets/images/alien.png');
        this.load.image('bone', 'assets/images/toys/bone.png');
        this.load.image('ball', 'assets/images/toys/tennisball.png');
      },
      create: function() {
        this.state.start('Game');
      }
    }
  };
  return IS
}])

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

angular.module('app.services')

.service( 'TriviaService', [function(){

  var trivia = {
  	questions: [
  		{
  			q: "6’ 9” Hafthór Júlíus Björnsson, also known as “The Mountain” in HBO’s Game of Thrones, is a world-record breaking keg tosser. How high did he throw a keg in November 2015?",
  			o: {
          "14-8": '14’ 8”',
          "20-3": '20’ 3”',
          "24-6": '24’ 6”',
          "32-32": '32’ 8”'
  			},
  			a: "24-6",
  			n: "you're a nut!"
  		},
  		{
  			q: 'Approximately how many kg of CO2 equivalents did brewers reduce their carbon footprints by through using MicroStar’s pool of kegs rather than owning their own?',
  			o: {
  				"3k": "3,000",
  				"30k": "30,000",
  				"300k": "300,000",
  				"3m": '3,000,000'
  			},
  			a: "3m"
  		},
  		{
  			q: 'Which of these is not the name of a beer?',
  			o: {
  				"pyp": "Poop Your Pants",
  				"idmp": "I Dunkled In My Pants",
  				"pw": "Prestige Worldwide",
  				"rock": "Rock Out with Your Bock Out",
  			},
  			a: "pw"
  		},
  		{
  			q: 'The 1980’s show Knight Rider was syndicated in Latin Americ. What was it called?',
  			o: {
  				"a": "El Coche Fantastico",
  				"b": "Knight Rider",
  				"c": "Noche Jinete",
  			},
  			a: "a"
  		},
  		{
  			q: 'Which of these is not the name of a beer?',
  			o: {
  				"a": "Smells Like a Safety Meeting",
  				"b": "BEER",
  				"c": "Tom Brady Sucks",
  				"d": "Boats and Gose",
  			},
  			a: "c"
  		},
  		{
  			q: 'According to the Brewer’s Association’s 2015 Brewery Volume Report, who was the 7th largest craft brewer?',
  			o: {
  				"a": "Goose Island",
  				"b": "Lagunitas",
  				"c": "Gigantic",
  				"d": "Bell's",
  				"e": "Deschutes"
  			},
  			a: "d"
  		},
  		{
  			q: 'Which is NOT one of the three “Can’t Fail” principles to matching food and beer according the Brewers Association?',
  			o: {
  				"a": "Match Strength with Strength",
  				"b": "Find Harmonies",
  				"c": "Consider Sweetness, Bitterness, Carbonation, Heat (Spice), and Richness",
  				"d": "When in Doubt, Pair with Cool Ranch Doritos",
  			},
  			a: "d"
  		},
  		{
  			q: "What's your favorite color?",
  			o: {
  				"a": "Burnt Orange",
  				"b": "Forest Green",
  				"c": "Aqua Blue",
  				"d": "Camouflage",
  			},
  			a: "b"
  		},
  		{
  			q: 'What do they call a Quarter Pounder in France?',
  			o: {
  				"a": "Quarter Pounder",
  				"b": "Le Big Mac",
  				"c": "Royale with Cheese",
  				"d": "Trimestre du Boeuf",
  			},
  			a: "c"
  		},
  		{
  			q: 'Which beer won gold for Imperial Pale Ale at the 2016 World Beer Cup?',
  			o: {
  				"a": "Good Juju",
  				"b": "Hop Juju",
  				"c": "Cindy Loo Who"
  			},
  			a: "b"
  		},
  		{
  			q: 'What spice sometimes used in beer smells like Fruit Loops?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "c"
  		},
  		{
  			q: 'Which day of the year generates more sales for the whipped cream industry than any other single day?',
  			o: {
  				"a": "Thanksgiving",
  				"b": "Christmas",
  				"c": "May 12",
  				"d": "February 14 (put your thinking caps on, people...)",
  			},
  			a: "d"
  		},
  		{
  			q: 'Which of these is not the name of a brewery?',
  			o: {
  				"a": "Angry Cedar",
  				"b": "Angry Chair",
  				"c": "Angry Erik",
  				"d": "Angry Hanik",
  				"e": "Angry Minnow",
  				"f": "Just Plain Angry",
  			},
  			a: "f"
  		},
  		{
  			q: "Which singer's real name is Stefani Joanne Angelina Germanotta?",
  			o: {
  				"a": "Gwen Stefani",
  				"b": "Lady Gaga",
  				"c": "Beyoncé",
  				"d": "Justin Bieber",
  			},
  			a: "a"
  		},
  		{
  			q: 'Approximately how many liters in a 1/6bbl keg?',
  			o: {
  				"a": "10L",
  				"b": "20L",
  				"c": "30L",
  				"d": "40L",
  			},
  			a: "b"
  		},
  		{
  			q: 'In the Brewer’s Association’s 2015 Brewery Data, which animal is incorporated most frequently into brewery names?',
  			o: {
  				"a": "Rabbit",
  				"b": "Bear",
  				"c": "Fox",
  				"d": "Turtle",
  			},
  			a: "b"
  		},
  		{
  			q: 'How many letters are there in the German alphabet (HINT: Includes Umlauts and the ss-Ligature)',
  			o: {
  				"a": "24",
  				"b": "26",
  				"c": "28",
  				"d": "30",
  			},
  			a: "d"
  		},
  		{
  			q: 'How many kegs does MicroStar and KegCraft have in their combined fleets?',
  			o: {
  				"a": "8",
  				"b": "~1,000,000",
  				"c": "~2,000,000",
  				"d": "~3,000,000",
  			},
  			a: "d"
  		},
  		{
  			q: 'What’s your favorite type of cat?',
  			o: {
  				"a": "British Shorthair",
  				"b": "Bombay",
  				"c": "American Bobtail",
  				"d": "None of the above.  You prefer dogs",
  			},
  			a: "d"
  		},
  		{
  			q: 'What’s your favorite type of dog?',
  			o: {
  				"a": "Retriever",
  				"b": "German Shepherd",
  				"c": "Bulldog",
  				"d": "Doesn’t matter as long as it’s not a cat",
  			},
  			a: "d"
  		},
  		{
  			q: 'What keg valve type are used in Guinness kegs?',
  			o: {
  				"a": "A",
  				"b": "U",
  				"c": "s",
  				"d": "D",
  			},
  			a: "b"
  		},
  		{
  			q: 'What does  “R.R.” stand for in George R. R. Martin?',
  			o: {
  				"a": "Robert Redford",
  				"b": "Raymond Richard",
  				"c": "Red Rum",
  				"d": "Rolls Royce",
  			},
  			a: "b"
  		},
  		{
  			q: 'Which of the following is not an ingredient approved per the Reinheitsgebot?',
  			o: {
  				"a": "Water",
  				"b": "Corn",
  				"c": "Barley",
  				"d": "Hops",
  				"e": "Yeast"
  			},
  			a: "b"
  		},
  		{
  			q: 'Which of the following is not the name of a brewery?',
  			o: {
  				"a": "Hunga Dunga",
  				"b": "Miss Mcgillicuddy’s Beer Emporium",
  				"c": "Ass Clown"
  			},
  			a: "b"
  		},
  		{
  			q: 'Sobriety Test: Which is spelled correctly?',
  			o: {
  				"a": "Potato",
  				"b": "Potatoe"
  			},
  			a: "a"
  		},
  		{
  			q: 'What test did Gambrinus accomplish to earn his crown and admiration of generations of beer drinkers? ',
  			o: {
  				"a": 'He brewed the "perfect" beer',
  				"b": "He discovered how many licks it takes to get to the center of a Tootsie Pop",
  				"c": "He picked up and carried a full barrel (62 gallons of beer in wood) and carried it",
  				"d": "He vanquished Voldemort in a duel",
  			},
  			a: "c"
  		},
  		{
  			q: 'How is it said King Gambrinus was able to carry a full barrel (62 gallons of beer in wood)?',
  			o: {
  				"a": "He attached helium balloons",
  				"b": "He drank half of it first",
  				"c": "Steroids",
  				"d": "Seriously?",
  			},
  			a: "b"
  		},
  		{
  			q: 'What was the location of the first United States Marine Recruiting Station?',
  			o: {
  				"a": "A prison",
  				"b": "Wrigley Field",
  				"c": "A bar",
  				"d": "Boston Harbor",
  			},
  			a: "c"
  		},
  		{
  			q: 'In what country can beer be sold in vending machines, by street vendors and in train stations?',
  			o: {
  				"a": "England",
  				"b": "Japan",
  				"c": "India",
  				"d": "Brazil",
  			},
  			a: "b"
  		},
  		{
  			q: 'What is a labeorphilist?',
  			o: {
  				"a": "A beer bottle collector",
  				"b": "Brewing efficiency spcialist",
  				"c": "Label designer",
  				"d": "A what?",
  			},
  			a: "a"
  		},
  		{
  			q: 'What is Zythology?',
  			o: {
  				"a": "A city in Game of Thrones",
  				"b": "The study of beer and beer-making",
  				"c": "The process of harvesting hops",
  				"d": "A made-up word",
  			},
  			a: "b"
  		},
  		{
  			q: 'Which country drinks the most beer?',
  			o: {
  				"a": "Australia",
  				"b": "USA",
  				"c": "Germany",
  				"d": "Czech Republic",
  				"e": "Gondor",
  			},
  			a: "d",
  			n: "Per capita beer consumption in the Czech Republic ia almost 40 gallons a year."
  		},
  		{
  			q: 'What is Cenosillicaphobia?',
  			o: {
  				"a": "The fear of cold liquid",
  				"b": "The fear of carbonated beverages",
  				"c": "The fear of peach fuzz",
  				"d": "The fear of an empty beer glass",
  			},
  			a: "d"
  		},
  		{
  			q: 'How many people attend Oktoberfest in Munich every year?',
  			o: {
  				"a": "90,000",
  				"b": "800,000",
  				"c": "6,000,000",
  				"d": "9,000,000",
  			},
  			a: "c",
  		},
  		{
  			q: 'At any given time, what percentage of the world population is drunk?',
  			o: {
  				"a": "0.2%",
  				"b": "0.7%",
  				"c": "1.3%",
  				"d": "3.4%",
  				"e": "4.1%",
  			},
  			a: "b",
  			n: "That is about 50 million people!"
  		},
  		{
  			q: 'On what date in history was Prohibition repealed?',
  			o: {
  				"a": "October 10, 1915",
  				"b": "December 5, 1933",
  				"c": "July 4, 1940",
  				"d": "December 2, 1941",
  				"e": "December 5, 1944",
  			},
  			a: "b"
  		},
  		{
  			q: 'Which of the following hops varieties is not Noble?',
  			o: {
  				"a": "Hallertau",
  				"b": "Tettnanger",
  				"c": "Saaz",
  				"d": "Styrian Golding",
  			},
  			a: "d"
  		},
  		{
  			q: 'The Altbier style originated in which German city?',
  			o: {
  				"a": "Dusseldorf",
  				"b": "Cologne",
  				"c": "Berlin",
  				"d": "Munich",
  			},
  			a: "a"
  		},
  		{
  			q: 'Which of the following malts contains the most diastatic power?',
  			o: {
  				"a": "Black Malt",
  				"b": "Munich Malt",
  				"c": "Pilsen Malt",
  				"d": "Vienna Malt",
  			},
  			a: "c"
  		},
  		{
  			q: 'Sobriety Test: How many days are there in a year?',
  			o: {
  				"a": "365",
  				"b": "7",
  				"c": "365.25",
  				"d": "12",
  			},
  			a: "c",
  			n: 'Why do you think we have leap years!?'
  		},
  		{
  			q: 'A great deal of chemistry and biology goes into brewing a good beer. What is the terminology of the study of fermentation?',
  			o: {
  				"a": "Zymurgy",
  				"b": "Etymology",
  				"c": "Beerology",
  				"d": "Entomology",
  			},
  			a: "a"
  		}
  	],
  	get_question : function(){
		  var q =  this.questions[Math.floor(Math.random() * this.questions.length)];
		  return q;
  	}
  };
  return trivia
}]);

angular.module('app.services')

.service( 'WeaponService', [function(){

  var weapons = {
    //
    get_weapons  : function(){
     var $si = this;
     this.weapons = [
/*
        { "id" : "grenade",
			    "fireRate" : 700,
			    "fireLimit" : 20,
			    "bulletSpeed": 500,
			    "bulletAngleVariance" : 0,
			    "fireAngle": '345',
			    "automatic" : false,
			    "bulletGravity": new Phaser.Point(600, 600),
			    "bulletRotateToVelocity": true
		    },
		    { "id" : "auto-grenade",
			    "fireRate" : 200,
			    "fireLimit" : 40,
			    "bulletSpeed": 550,
			    "bulletAngleVariance" : 2,
			    "fireAngle": '345',
			    "automatic" : true,
			    "bulletGravity": new Phaser.Point(600, 600),
			    "bulletRotateToVelocity": true
		    },
*/
		    { "id" : "multi-grenade",
			    "fireRate" : 300,
			    "fireLimit" : 50,
			    "bulletSpeed": 950,
			    //"bulletAngleVariance" : 2,
			    //"fireAngle": '350',
			    "automatic" : true,
			    //"bulletGravity": new Phaser.Point(350, 20),
			    //"bulletRotateToVelocity": true
		    },

/*
		    { "id" : "single",
			    "fireRate" : 700,
			    "fireLimit" : 50,
			    "fireAngle": '0',
			    "bulletAngleVariance" : 0,
			    'automatic': false,
			    "bulletGravity": new Phaser.Point(0,0),
			    "bulletSpeed": 1000
		    },
		    { "id" : "automatic",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 0,
			    "automatic" : true,
			    "bulletSpeed": 1000
		    },
		    { "id" : "automatic_spread",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 10,
			    "automatic" : true,
		    }
*/
		  ]
		  // save the keys for access
		  this.weaponKeys = [];
		  _.each( this.weapons, function(w){
  		  $si.weaponKeys.push( w.key );
		  });
		  return this.weapons;
    },
    get_random : function(){
      var rand = Math.ceil(Math.random(0, this.weaponKeys.length ));
      return this.weapons[ rand ] ;
    },
    // set a weapon by key or index
    // accepts the key and the context ( this / game )
    set_weapon : function( key , context  ){
      var weapons = this.get_weapons();
      var $gi = context
      $gi.weapon = $gi.game.add.weapon(30, 'pint');
      $gi.weapon.enableBody = true;
      $gi.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      $gi.weapon.bulletAngleOffset = 90;
      //$gi.weapon.bulletSpeed = 1000;


      if(typeof ( key ) === 'string' ){
  			var option =  _.find( weapons, function( o , k ){
    			if(o.id === key ) $gi.currentWeaponIndex = k;
  			  return o.id === key;
  		  });
  		}
      if(typeof ( key ) === 'number' ) {
        $gi.currentWeaponIndex = key;
        option = weapons[key];
      }

  	  $gi.currentWeapon = option;
  	  _.each( option, function ( o , k ){
  		  $gi.weapon[k] = o;
  	  })

      //$gi.weapon.bulletGravity = -1000;

      $gi.weapon.trackSprite($gi.player, 54, -40, false);
      //$gi.weapon.fireRate = 1000;
      $gi.fireButton = $gi.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
      $gi.fireButton.onDown.add(function(e ){
  	    //console.log( e )
  			$gi.weapon.fire();
      }, $gi);
  	  $gi.weapon.resetShots();
    }
  };
  return weapons
}]);

angular.module( 'app.controllers' )
.controller( 'AppController', ['$scope', '$http', 'AppService',
function($scope, $http, AS){
  $scope.menu_open = false;

}])

angular.module( 'app.controllers' )
.controller( 'GameController', ['$scope', '$http', 'AppService','GameService', 'TriviaService', 'WeaponService', "LeaderBoardService",'$ionicPopup', '$state', '$ionicModal',
function($scope, $http, AS, GS, TS, WS, LBS, $ionicPopup, $state , $ionicModal){


  $ionicModal.fromTemplateUrl('templates/challenge-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.challengeModal = modal;
  });



  function create_game(){
    $scope.game = GS.Game = {
    	preload: function() {
    		this.game.time.advancedTiming = true;
    	},
    	create: function() {
    		//set some variables we need throughout the game
    		this.damage = 0;
    		this.wraps = 0;
    		this.points = 0;
    		this.wrapping = true;
    		this.stopped = false;
    		this.maxDamage = 3;
    		this.numAliens = 5;
    		this.w = this.game.width;
    		this.h = this.game.height;
    		this.default_velocity = {
    			"x": 300,
    			"y": 0
    		}
    		this.challenges = TS.questions;
    		this.challenges_complete = 0;
    		this.background = this.add.tileSprite(0, 0, 750, 480, "background");
    		this.background.fixedToCamera = true;


    		//set up background and ground layer
    		this.game.world.setBounds(0, 0, 3500, this.game.height);
    		this.grass = this.add.tileSprite(0,this.game.height-40,this.game.world.width,20,'grass');
    		this.ground = this.add.tileSprite(0,this.game.height-20,this.game.world.width,70,'ground');
    		this.clouds = 2;
    		this.generateClouds();




    		//create player and walk animation
    		this.player = this.game.add.sprite(this.game.width/2, this.game.height-90, 'hunter');
    		this.player.scale.setTo(1,1);
    		this.player.animations.add('walk', [4,5], 10, true);
    		this.player.animations.add('stand', [2,3], 3, true);


    		//create the aliens
    		this.generateAliens();
    		//and the toy mounds
    		this.generateHops();
    		this.create_weapons();
    		this.generateNewWeapon();
    		this.display_stats();



    		//put everything in the correct order (the grass will be camoflauge),
    		//but the toy mounds have to be above that to be seen, but behind the
    		//ground so they barely stick up
    		this.game.world.bringToTop(this.grass);
    		//this.game.world.bringToTop(this.mounds);
    		this.game.world.bringToTop(this.ground);

    		// not sure what this doee, exactly, but it fixes the fall-through-floor issue
        this.game.physics.arcade.TILE_BIAS = 40;

    		//enable physics on the player and ground
    		this.game.physics.arcade.enable(this.player);
    		this.game.physics.arcade.enable(this.ground);

    		//player gravity
    		this.player.body.gravity.y = 1000;

    		//so player can walk on ground
    		this.ground.body.immovable = true;
    		this.ground.body.allowGravity = false;

    		//properties when the player is digging, scratching and standing, so we can use in update()
    		//var playerDigImg = this.game.cache.getImage('playerDig');
    		//this.player.animations.add('dig');
    		//this.player.digDimensions = {width: playerDigImg.width, height: playerDigImg.height};

    		//var playerScratchImg = this.game.cache.getImage('playerScratch');
    		//this.player.animations.add('scratch');
    		//this.player.scratchDimensions = {width: playerScratchImg.width, height: playerScratchImg.height};

    		this.player.standDimensions = {width: this.player.width, height: this.player.height};
    		this.player.anchor.setTo(0.5, 1);

    		//the camera will follow the player in the world
    		this.game.camera.follow(this.player);

    		//play the walking animation
    		this.player.animations.play('walk', 3, true);

    		//move player with cursor keys
    		this.cursors = this.game.input.keyboard.createCursorKeys();


    		//sounds
    		this.collectSound = this.game.add.audio('blip');
    		this.explodeSound = this.game.add.audio('explosion');
    		this.gameOverSound = this.game.add.audio('game-over');
    		this.hurtSound = this.game.add.audio('hurt');
    		this.jumpSound = this.game.add.audio('jump');
    		this.lazerSound = this.game.add.audio('lazer');
    		this.lifeSound = this.game.add.audio('life');
    		this.levelUpSound = this.game.add.audio('level-up');
    		this.music = this.game.add.audio('soundtrack');
    		this.tosseSound = this.game.add.audio('toss');


        this.music.loopFull(0.6);

    	//this.damageSound = this.game.add.audio('damage');
    		var RIGHT = 0, LEFT = 1;/* Divide the current tap x coordinate to half the game.width, floor it and there you go */
    		var $gi = this;

    		this.build_buttons( );

        //this.challenge();

      },
      pause: function() {

      	// When the paus button is pressed, we pause the game
      	//this.pause_label = this.add.text(this.w/2, 100, 'Resume', { font: '24px Arial', fill: '#fff' });
      	this.pause_label.setText('Resume');

      	this.paused = true;
      	this.stopped = true;
      	this.player.body.velocity.x = 0;
      	this.player.animations.play('stand', 10, true);

      	// Then add the menu
      	this.pause_menu_restart = this.add.text(this.w/2, 48, 'Restart', { font: '24px Arial', fill: '#fff' });
      	this.pause_menu_restart.inputEnabled = true;
      	this.pause_menu_restart.fixedToCamera = true;
      	this.pause_menu_restart.events.onInputUp.add( function() { this.state.start('Game'); }, this);

      	this.pause_menu_quit = this.add.text(this.w/2, 72, 'Quit', { font: '24px Arial', fill: '#fff' })
      	this.pause_menu_quit.inputEnabled = true;
      	this.pause_menu_quit.fixedToCamera = true;
      	this.pause_menu_quit.events.onInputUp.add( function() {
          //this.create();
          this.game.sound.mute = true;

          window.location.hash = "";
        }, this);

        this.pause_menu_sound = this.add.text(this.w/2, 112, 'Sound On', { font: '24px Arial', fill: '#fff' });
      	if( this.game.sound.mute === false ) {
             this.pause_menu_sound.setText('Sound On');
          } else {
            this.pause_menu_sound.setText('Sound Off');
          }

      	this.pause_menu_sound.inputEnabled = true;
      	this.pause_menu_sound.fixedToCamera = true;
      	this.pause_menu_sound.events.onInputUp.add( function() {
          if( this.game.sound.mute === false ) {
             this.game.sound.mute = true;
             this.pause_menu_sound.setText('Sound Off');

          } else {
            this.game.sound.mute = false;
            this.pause_menu_sound.setText('Sound On');
          }


        }, this);


    	// Stop the extras from floating by
        _.forEach(this.aliens.children, function(alien) {
    	    //console.log(alien);
    	    alien.body.velocity.x = 0;
        });

         _.forEach(this.hops.children, function(hop) {
    	    //console.log(alien);
    	    hop.body.velocity.x = 0;
        });

        _.forEach(this.weapons.children, function(weapon) {
    	    //console.log(alien);
    	    weapon.body.velocity.x = 0;
        });

        _.forEach(this.clouds.children, function(cloud) {
    	    //console.log(alien);
    	    cloud.body.velocity.x = 0;
        });

        if( typeof this.castles !== 'undefined' ) {
          _.forEach(this.castles.children, function(castle) {
      	    //console.log(alien);
      	    castle.body.velocity.x = 0;
          });
        }





    	// Add a input listener that can help us return from being paused
    	//this.input.onDown.add(this.unpause, self);

      },
      unpause: function() {


      	// Remove the menu and the label
      	this.pause_label.setText('Pause');
      	this.pause_menu_restart.destroy();
      	this.pause_menu_quit.destroy();
      	this.pause_menu_sound.destroy();

      	// Unpause the game
      	this.paused = false;
      	this.stopped = false;
      	this.player.body.velocity.x = this.default_velocity.x;
      	this.player.animations.play('walk', 3, true);


      },
      //
      unfrozen: function() {
    	this.paused = false;
    	this.stopped = false;
    	this.player.body.velocity.x = this.default_velocity.x;
    	this.player.animations.play('walk', 3, true);

      },
      frozen: function() {
      	this.paused = true;
      	this.stopped = true;
      	this.player.body.velocity.x = 0;

    	  // Stop the extras from floating by
        _.forEach(this.aliens.children, function(alien) {
    	    //console.log(alien);
    	    alien.body.velocity.x = 0;
        });

         _.forEach(this.hops.children, function(hop) {
    	    //console.log(alien);
    	    hop.body.velocity.x = 0;
        });

        _.forEach(this.weapons.children, function(weapon) {
    	    //console.log(alien);
    	    weapon.body.velocity.x = 0;
        });

        if( typeof this.castles !== 'undefined' ) {
          _.forEach(this.castles.children, function(castle) {
      	    //console.log(alien);
      	    castle.body.velocity.x = 0;
          });
        }


        _.forEach(this.clouds.children, function(cloud) {
    	    //console.log(alien);
    	    cloud.body.velocity.x = 0;
        });

      },
      // check the wraps / challenges complete then add the castle.

      challengeMaybe : function(){
        if( this.wraps % 3 !== 0 && this.challenges_complete !== this.wraps ) {
          //this.challenging = true;
  	      this.challenges_complete = this.wraps;
          this.addCastle();
          this.game.world.bringToTop( this.buttons );

        }else{
          return false;
        }
      }, // should we present a trivia item
      // activated when the user runs into the castle.
      // present a challenge while pausing the game.

      answer_challenge : function($answer, $correct_answer ){
        $scope.my_answer = $answer;
        var $gi = this;
        return false;
        if($answer === $correct_answer){
    			$gi.points += 100;
    			$gi.maxDamage += 1;
    			$gi.lifeSound.play();
    			$scope.answered_correct = true;
        }else{
    			$scope.answered_correct = true;
    			$gi.hurtSound.play();
    			$gi.maxDamage += -1;
    			$gi.refreshStats();
        }
    		setTimeout(function() {
    			$('#challenge').addClass('hide');
    			$scope.challengeModal.hide();
          $('.current-question').remove();

    			$gi.unfrozen();
    			setTimeout( function() {
      			$gi.challenging = false;
      			$gi.challenging = false;
    			}, 1500);

    		}, 500);
      },
      challenge: function() {

        var $gi = this;
        //console.log(  this.challenging );

       // if( ( this.player.body.touching.right ) && this.challenging !== true && this.maxDamage - this.damage >= 1 ){
    			$scope.answered_correct = false;
          this.challenging = true;
      	  this.frozen();


          $scope.challengeModal.show();


      	  //$('#challenge').removeClass('hide');

          //var get_question = function( data ){
      	//	var q =  data[Math.floor(Math.random() * data.length)];
      		 // return q;
          //};

        	$scope.current_question = TS.get_question(  );

/*
        	var templates = {
        		"gameover": _.template( $('.templates #gameover').html() ),
        		"question": _.template( $('.templates #aQuestion').html() ),
        		"options": _.template( $('.templates #options').html() ),
        	};
*/

/*
        	$('#challenge').append( templates.question({
        		question: current_question.q,
        		options: current_question.o,
        		answer: current_question.a,
        		n: current_question.n
        	}) );
*/

/*
        	$(document).on('click', 'button[data-value]', function() {
        		var answer = $(document).find('#the_answer').val();

        		if( $(this).data('value') === answer ) {
        			$(this).addClass('correct');
        			$gi.points += 100;
        			$gi.maxDamage += 1;
        			$gi.lifeSound.play();

        			$gi.refreshStats();
        		} else {
        			$(this).addClass('false');
        			$gi.hurtSound.play();
        			$gi.maxDamage += -1;
        			$gi.refreshStats();
        		}
        		$('.note').removeClass('hide');

        		setTimeout(function() {
        			$('#challenge').addClass('hide');
              $('.current-question').remove();

              //$gi.castles.destroy();

        			$gi.unfrozen();
        			setTimeout( function() {
          			$gi.challenging = false;
          			this.challenging = false;
        			}, 1500);

        		}, 500);
        	});
*/
        //}// if challenge


      }, // challenge
      update: function() {

      	var $gi = this;

        //collision
        this.game.physics.arcade.collide(this.player, this.ground, this.playerHit, null, this);
        this.game.physics.arcade.collide(this.player, this.aliens, this.playerDamage, null, this);
        this.game.physics.arcade.collide(this.weapon.bullets, this.aliens, this.alienKilled, null, this );
      	this.game.physics.arcade.overlap(this.player, this.hops, this.collectHops, null, this);
      	this.game.physics.arcade.overlap(this.player, this.weapons, this.weaponUp, null, this);



      	if( this.challenging !== true  ){
        	this.game.physics.arcade.collide(this.player, this.castles, this.challenge, function() {

          	if( $gi.challenging === true ) {
            	return false;
          	} else {
            	return true;
          	}



          }, this);
        }

        //only respond to keys and keep the speed if the player is alive
        //we also don't want to do anything if the player is stopped for scratching or digging
        if(this.player.alive && !this.stopped) {

          if( this.challengeMaybe() ) {
          } else {
            this.player.body.velocity.x = this.default_velocity.x + ( 15 * this.wraps );

            //We do a little math to determine whether the game world has wrapped around.
            //If so, we want to destroy everything and regenerate, so the game will remain random
            if(!this.wrapping && this.player.x < this.game.width) {
              //Not used yet, but may be useful to know how many times we've wrapped
              this.wraps++;

              //We only want to destroy and regenerate once per wrap, so we test with wrapping var
              this.wrapping = true;
              this.aliens.destroy();
              this.generateAliens();
              this.hops.destroy();
              this.generateHops();
              this.weapons.destroy();
              this.generateNewWeapon();
              //this.clouds.destroy();
              //this.generateClouds();
              if(typeof( this.castles ) !== 'undefined')  this.castles.destroy();

              //put everything back in the proper order
              //         this.game.world.bringToTop(this.grass);
              //         this.game.world.bringToTop(this.ground);
              this.game.world.bringToTop(this.hops);
              this.game.world.bringToTop(this.weapons);
              this.game.world.bringToTop(this.clouds);
              this.game.world.bringToTop(this.buttons);

            }
            else if(this.player.x >= this.game.width) {
              this.wrapping = false;
            }

          }

          //this.player.body.velocity.x = this.default_velocity.x;


          if ( this.cursors.up.isDown) {

            this.playerJump();
          }

          if ( this.fireButton.isDown || this.firing ) {
    		    this.lazerSound.play();
    		    this.weapon.fire();
    		    this.refreshStats();

          }

          this.game.world.bringToTop(this.buttons);

          //The game world is infinite in the x-direction, so we wrap around.
          //We subtract padding so the player will remain in the middle of the screen when
            //wrapping, rather than going to the end of the screen first.
          this.game.world.wrap(this.player, -(this.game.width/2), false, true, false);
          this.game.world.wrap(this.clouds, 0, false, true, false);
        }




      }, // update

      addCastle : function(){
        var castle,
          castleHeight = 60
          castleScale = 2.5;
        this.castles = this.game.add.group();
        this.castles.enableBody = true;
        castle = this.castles.create(this.game.width, this.game.height - (castleHeight * castleScale) - 12, 'castle');
        castle.body.velocity.x = this.game.rnd.integerInRange(0, 0);
        castle.scale.setTo(castleScale, castleScale);
        castle.body.immovable = false;
        castle.body.collideWorldBounds = false;
        this.game.world.bringToTop(this.castles);
        this.game.world.bringToTop(this.buttons);
        //castle.body.stopVelocityOnCollide = false;

      }, // add the castle after checking wraps

    	display_stats : function(){
        var style1 = { font: "20px Arial", fill: "#ff0"};
        var t1 = this.game.add.text(10, 20, "Score:", style1);
        t1.fixedToCamera = true;
        var t2 = this.game.add.text(this.game.width-100, 20, "Life:", style1);
        t2.fixedToCamera = true;

        var t3 = this.game.add.text(this.game.width-220, 20, "Shots:", style1);
        t3.fixedToCamera = true;


        var style2 = { font: "26px Arial", fill: "#00ff00"};
        this.pointsText = this.game.add.text(80, 18, "", style2);
        this.aliensText = this.game.add.text(this.game.width-50, 18, "", style2);
        this.shotsText = this.game.add.text(this.game.width-150, 18, "1", style2);
        this.refreshStats();
        this.pointsText.fixedToCamera = true;
        this.aliensText.fixedToCamera = true;
        this.shotsText.fixedToCamera = true;
    	},

      create_weapons : function(){
    	  this.firing = false;
        WS.set_weapon( 0, this  )
      }, // create_weapons
      set_weapon : function( key ){
    		WS.set_weapon( key , this);
      }, // set_weapon
      build_buttons : function ( ){
    	  var $gi = this;
    	  $gi.buttons = {
    		  up : {},
    		  fire : {}
    	  }
        $gi.buttons.up = $gi.game.add.button($gi.game.width - 50, $gi.world.height - 50, 'buttons', (function(){}), $gi, 4,4,5);
        $gi.buttons.up.onInputUp.add(function(e ){
    			$gi.playerJump();
        }, this);
        $gi.buttons.up.onInputDown.add(function(e ){
    			$gi.playerJump();
        }, this);
    		$gi.buttons.up.fixedToCamera = true;
        $gi.buttons.up.scale.setTo( 1.5, 1.5 );
        $gi.buttons.up.onInputDown.add(function(e ){ }, this);
        $gi.buttons.up.onInputUp.add(function(){ }, this);

        $gi.buttons.fire = $gi.game.add.button(0, $gi.world.height - 50, 'buttons', (function(){}), $gi, 4,4,5);
        $gi.buttons.fire.onInputDown.add(function(e ){
    	    $gi.firing = true;
    	    this.lazerSound.play();
    			$gi.weapon.fire();
        }, this);
        $gi.buttons.fire.onInputUp.add(function(e ){
    	    this.firing = false;
        }, this);
    		$gi.buttons.fire.fixedToCamera = true;
        $gi.buttons.fire.scale.setTo( 1.5, 1.5 );
        $gi.buttons.fire.onInputDown.add(function(e ){ }, this);
        $gi.buttons.fire.onInputUp.add(function(){ }, this);

        $gi.pause_label = $gi.add.text(this.w/2, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
    	$gi.pause_label.inputEnabled = true;
    	$gi.pause_label.fixedToCamera = true;
    	$gi.pause_label.events.onInputUp.add( function() {
    		if( this.stopped !== true ) {
    			this.pause();
    		} else {
    			this.unpause();
    		}
    	}, this);


      },

      //show updated stats values
      refreshStats: function() {
        this.pointsText.text = this.points;
        this.aliensText.text = this.maxDamage - this.damage;
        this.shotsText.text = this.weapon.fireLimit -  this.weapon.shots;
      },
      playerHit: function(player, blockedLayer) {
        if(player.body.touching.right) {
          //can add other functionality here for extra obstacles later
        }
      },
      alienKilled : function(bullet, alien){
        this.explodeSound.play();
        this.aliens.remove( alien );
        bullet.kill();
    		this.points += 1;
    		this.refreshStats();
      },
      //the player has just been bitten by a alien
      died: function() {

      },
      playerDamage: function(player, alien) {
    	  if(player.body.touching.down && alien.body.touching.up ){
    	    //remove the alien that bit our player so it is no longer in the way
    	    this.points++;
    	    this.refreshStats();
    	    alien.body.velocity.y = 100;
    	    alien.body.velocity.x = 0;


    	  }else{
    	    //remove the alien that bit our player so it is no longer in the way
    	    //this.explodeSound.play();
    	    alien.destroy();

    	    //update our stats
    	    this.damage++;
    	    this.refreshStats();

    			if(this.damage >= this.maxDamage){
    				this.music.stop();
    				this.gameOverSound.play();
    				//this.stopped = true;
    				//this.player.body.velocity.x = 0;

    				this.frozen();

    				this.player.animations.play('stand', 10, true);
    		    var gO = this.game.add.text((this.game.width / 2) - 50, this.game.height / 2 - 90, "Game Over", { font: "24px Arial", fill: "#ff0"});
    		    gO.fixedToCamera = true;
/*
    		    gO.inputEnabled = true;
            gO.events.onInputUp.add( function() {
                this.state.start('Game');
            }, this);
*/

            var again = this.game.add.text((this.game.width / 4) - 50, this.game.height / 2, "Play Again", { font: "20px Arial", fill: "#ff0"});
    		    again.fixedToCamera = true;
    		    again.inputEnabled = true;
            again.events.onInputUp.add( function() {
                this.state.start('Game');
            }, this);

            var score = this.game.add.text((this.game.width / 2) + 50, this.game.height / 2, "Your Score: " + this.points, { font: "20px Arial", fill: "#ff0"});
    		    score.fixedToCamera = true;

    		    console.log( 'GO: ' + this.points );


/*
    			  var $gi = this;
    		    $gi.start_new = $gi.game.add.button($gi.game.width  / 2, $gi.world.height  / 2, 'buttons', (function(){}), $gi, 4,4,5);
    		    $gi.start_new.onInputDown.add(function(e ){
    					this.state.start('Game');
    		    }, this);
    				$gi.start_new.fixedToCamera = true;
    		    $gi.start_new.scale.setTo( 1.5, 1.5 );
*/


           if( LBS.checkHighScore(this.points))  this.saveHighScore();
    				return false;
    			}

    	    //change sprite image
    	    //this.player.loadTexture('playerScratch');
    	    this.player.animations.play('stand', 10, true);

    	    //play audio
    	    this.hurtSound.play();

    	    //wait a couple of seconds for the scratch animation to play before continuing
    	    //this.stopped = true;
    	    this.frozen();
    	    //this.player.body.velocity.x = 0;
    	    var $gi = this;
    	    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
    		    //this.stopped = false;
    		    $gi.player.animations.play('walk');
    				//$gi.player.body.velocity.x = 300;
    				this.unfrozen();
    	    }, this);


    	  }
      },
      // let the user save their score
      saveHighScore : function(){
         $ionicPopup.show({
           template: '<input type="text" ng-model="game.initials">',
           title: 'New High Score!',
           subTitle: 'Enter Your Initials and Live in Glory ',
           scope: $scope,
           buttons: [
             { text: 'Cancel' },
             {
               text: '<b>Save</b>',
               type: 'button-positive',
               onTap: function(e) {
                 LBS.saveScore( $scope.game.initials, $scope.game.points )
               }
             },
           ]
         }).then(function(){
            var $p = $ionicPopup.alert({
               title: 'Way to go ' + $scope.game.initials + '!',
               //template: '<a class = "button button-block button-positive" ui-sref="leader-board">View Leaderboard</a>',
               buttons: [
                {
                 text: 'Cancel' ,
                 type : 'button-assertive',
                },
                {
                 text: 'LeaderBoard' ,
                 type : 'button-positive',
                 onTap : function( e ){
                   $p.close();
                   $state.go('leader-board')
                 }
                }
              ],
             })
         })
      },
      //the player is collecting a toy from a mound
      collectHops: function(player, hop) {
        this.hops.remove( hop );
        this.collectSound.play();
        hop.kill();
    		this.points += 1;
    		this.refreshStats();
      },
      //the player is collecting a toy from a mound
      weaponUp: function(player, weapon) {
        this.weapons.remove( weapon );
        this.levelUpSound.play();
        weapon.kill();
        WS.set_weapon( weapon.ref.id , this );
      },
    	// you lost. dang.
      gameOver: function() {
        this.music.stop();
        this.gameOverSound.play();
        this.game.state.start('Game');
      },
      playerJump: function() {
        //when the ground is a sprite, we need to test for "touching" instead of "blocked"
        if(this.player.body.touching.down) {
          this.jumpSound.play();
          this.player.body.velocity.y -= 700;
        }
      },
      generateHops: function() {

        this.hops = this.game.add.group();

        //enable physics in them
        this.hops.enableBody = true;

        //phaser's random number generator
        var numHops = this.game.rnd.integerInRange(1, 10)
        var hop;

        for (var i = 0; i < numHops; i++) {
          //add sprite within an area excluding the beginning and ending
          //  of the game world so items won't suddenly appear or disappear when wrapping
          var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
          var y = this.game.rnd.integerInRange(this.game.height - 200, ( this.game.world.height - this.game.height)  );
          hop = this.hops.create(x, y, 'hop');

          //physics properties
          hop.body.velocity.x = this.game.rnd.integerInRange(-20, 0);
          hop.scale.setTo(1, 1);
          hop.body.immovable = true;
          hop.body.collideWorldBounds = false;
    			hop.animations.add('play', null, 10, true);
    			hop.animations.play( 'play' );
        }
      },
      generateClouds: function() {
        var cloud;
        this.clouds = this.game.add.group();

        this.clouds.enableBody = true;
        this.numClouds = this.game.rnd.integerInRange(3, 4);

        for (var i = 1; i <= this.numClouds; i++) {
          //add sprite within an area excluding the beginning and ending
          //  of the game world so items won't suddenly appear or disappear when wrapping
          var x = this.game.rnd.integerInRange(300, 1000);
          var y = this.game.rnd.integerInRange(10, 100 );
          var scale = this.game.rnd.integerInRange(2, 7 ) * 0.1;
          cloud = this.clouds.create(x, y, 'cloud'+i);

          //physics properties
          cloud.body.velocity.x = this.game.rnd.integerInRange(250, 310);


          cloud.scale.setTo(scale, scale);
          cloud.body.immovable = false;
          cloud.body.collideWorldBounds = false;
        }

      },
      generateAliens: function() {
        var alien;
        this.aliens = this.game.add.group();

        //enable physics in them
        this.aliens.enableBody = true;

        //phaser's random number generator
    	  this.numAliens += 1;

        for (var i = 0; i < this.numAliens; i++) {
          //add sprite within an area excluding the beginning and ending
          //  of the game world so items won't suddenly appear or disappear when wrapping
          var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
          var y = this.game.rnd.integerInRange(this.game.height - 100, this.game.world.height - this.game.height );
          alien = this.aliens.create(x, y, 'alien');

          //physics properties
          alien.body.velocity.x = this.game.rnd.integerInRange(-20, 0);
          alien.scale.setTo(.5, .5);
          alien.body.immovable = true;
          alien.body.collideWorldBounds = false;
        }
      },

      // create weapons to collect
      generateNewWeapon: function() {
        var weapon;
        this.weapons = this.game.add.group();
        this.weapons.enableBody = true;
        var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
        var y = this.game.rnd.integerInRange(this.game.height - 100, this.game.world.height - this.game.height );
        var weaponRef = WS.get_random( );
        weapon = this.weapons.create(x, y, 'pint');
        weapon.ref = weaponRef;
        weapon.body.velocity.x = this.game.rnd.integerInRange(-20, 0);
        weapon.scale.setTo(.5, .5);
        weapon.body.immovable = true;
        weapon.body.collideWorldBounds = false;
      },

      render: function()
        {
            //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
        }

    }// END GAME
    //$scope.game.saveHighScore();
  }// END create_game




  function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

  function init(){
    //setting game configuration and loading the assets for the loading screen
    GS.game = new Phaser.Game(745, 420, Phaser.CANVAS, 'gameDiv');
    GS.game.state.add('Boot', GS.Boot);
    GS.game.state.add('Preload', GS.Preload);
    GS.game.state.add('Game', GS.Game);
    GS.game.state.start('Boot');
  }// END INIT

  // create the game bro
  create_game();
  // start the game
  init();

}])

angular.module( 'app.controllers' )
.controller( 'LeaderBoardController', ['$scope', '$http', 'AppService', 'LeaderBoardService',
function($scope, $http, AS, LBS){

  $scope.leaders = LBS.leaders;

}])

angular.module( 'app.controllers' )
.controller( 'PosterViewController', ['$scope', '$http', 'AppService', 'PosterViewService',
function($scope, $http, AS, PVS ){

  $scope.posters = PVS.posters;
}])
