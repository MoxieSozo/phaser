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
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('grass', 'assets/images/grass.png');
        this.load.audio('damage', ['assets/audio/whine.ogg', 'assets/audio/whine.mp3']);
        //this.load.audio('bark', ['assets/audio/bark.ogg', 'assets/audio/bark.mp3']);

        this.load.image('mound', 'assets/images/rock.png');

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

angular.module( 'app.services')
.service( 'PosterViewService', [function(){

  var $service = {
    get_posters  : function(){
      return [
        {'year' : '2011', 'name' : 'Blah', 'src' : '2011.png'},
        {'year' : '2012', 'name' : 'Blah', 'src' : '2012.png'},
        {'year' : '2013', 'name' : 'Blah', 'src' : '2013.png'}
      ]
    }
  }

  $service.posters = $service.get_posters();

  return $service;

}])

angular.module('app.services')

.service( 'TriviaService', [function(){

  var trivia = {
  	questions: [
  		{
  			q: 'How much beer can an astronaut drink in space?',
  			o: {
  				"some": "Some",
  				"lots": "Lots!",
  				"none": "None :(",
  			},
  			a: "lots"
  		},
  		{
  			q: '6&rsquo; 9&rdquo; Hafth&oacute;r J&uacute;l&iacute;us Bj&ouml;rnsson, also known as &ldquo;The Mountain&rdquo; in HBO&rsquo;s Game of Thrones, is a world-record breaking keg tosser. How high did he throw a keg in November 2015?',
  			o: {
          "14-8": '14&rsquo; 8&rdquo;',
          "20-3": '20&rsquo; 3&rdquo;',
          "24-6": '24&rsquo; 6&rdquo;',
          "32-32": '32&rsquo; 8&rdquo;'
  			},
  			a: "24-6"
  		},
  		{
  			q: 'Approximately how many kg of CO2 equivalents did brewers reduce their carbon footprints by through using MicroStar&rsquo;s pool of kegs rather than owning their own?',
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
  			q: 'The 1980&rsquo;s show Knight Rider was syndicated in Latin Americ. What was it called?',
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
  			q: 'According to the Brewer&rsquo;s Association&rsquo;s 2015 Brewery Volume Report, who was the 7th largest craft brewer?',
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
  			q: 'Which is NOT one of the three &ldquo;Can&rsquo;t Fail&rdquo; principles to matching food and beer according the Brewers Association?',
  			o: {
  				"a": "Match Strength with Strength",
  				"b": "Find Harmonies",
  				"c": "Consider Sweetness, Bitterness, Carbonation, Heat (Spice), and Richness",
  				"d": "When in Doubt, Pair with Cool Ranch Doritos",
  			},
  			a: "d"
  		},
  		{
  			q: 'What&rsquo;s your favorite color?',
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
  			a: "xxx"
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
  				"d": "February 14 (put your thinking caps on, people&hellip;)",
  			},
  			a: "d"
  		},
  		{
  			q: 'Which of these is not the name of a brewery?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: ' Which singer&rsquo;s real name is Stefani Joanne Angelina Germanotta?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'Approximately how many liters in a 1/6bbl keg?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'In the Brewer’s Association’s 2015 Brewery Data, which animal is incorporated most frequently into brewery names?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'How many letters are there in the German alphabet (HINT: Includes Umlauts and the ss-Ligature)',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'How many kegs does MicroStar and KegCraft have in their combined fleets?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'What’s your favorite type of cat?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "d"
  		},
  		{
  			q: 'What’s your favorite type of dog?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'What keg valve type are used in Guinness kegs?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'What does  “R.R.” stand for in George R. R. Martin?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'Which of the following is not an ingredient approved per the Reinheitsgebot?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'Which of the following is not the name of a brewery?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'Sobriety Test: Which is spelled correctly?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'What test did Gambrinus accomplish to earn his crown and admiration of generations of beer drinkers? ',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'How is it said King Gambrinus was able to carry a full barrel (62 gallons of beer in wood)?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "Coriander",
  				"d": "Cinnamon",
  			},
  			a: "ccc"
  		},
  		{
  			q: 'What was the location of the first United States Marine Recruiting Station?',
  			o: {
  				"a": "Paprika",
  				"b": "Marjoram",
  				"c": "A Bar",
  				"d": "Cinnamon",
  			},
  			a: "c"
  		},
  		{
  			q: 'In what country can beer be sold in vending machines, by street vendors and in train stations?',
  			o: {
  				"a": "Paprika",
  				"b": "Japan",
  				"c": "Coriander",
  				"d": "Cinnamon",
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
  			a: "ccc",
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
  	]
  };
  return trivia
}]);

angular.module('app.services')

.service( 'WeaponService', [function(){

  var weapons = {
    //
    get_weapons  : function(){

     this.weapons = [
		    { "id" : "single",
			    "fireRate" : 100,
			    "fireLimit" : 50,
			    "bulletAngleVariance" : 0,
			    'automatic': false

		    },
		    { "id" : "automatic",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 0,
			    "automatic" : true,
		    },
		    { "id" : "automatic_spread",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 10,
			    "automatic" : true,
		    },
		  ]
		  return this.weapons;
    },
    // set a weapon by key or index
    // accepts the key and the context ( this / game )
    set_weapon : function( key , context  ){
      var weapons = this.get_weapons();
      var $gi = context
      $gi.weapon = $gi.game.add.weapon(30, 'bullet');
      $gi.weapon.enableBody = true;
      $gi.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      $gi.weapon.bulletAngleOffset = 90;
      $gi.weapon.bulletSpeed = 1000;
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


      $gi.weapon.trackSprite($gi.player, 54, -40, true);
      $gi.fireButton = $gi.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
      $gi.fireButton.onDown.add(function(e ){
  	    console.log( e )
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

}])

angular.module( 'app.controllers' )
.controller( 'GameController', ['$scope', '$http', 'AppService','GameService', 'TriviaService', 'WeaponService',
function($scope, $http, AS, GS, TS, WS){
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
    		this.maxDamage = 5;
    		this.numAliens = 5;
    		this.w = this.game.width;
    		this.h = this.game.height;
    		this.default_velocity = {
    			"x": 300,
    			"y": 0
    		}
    		this.challenges = TS.questions;
    		this.challenges_complete = 0;


    		//set up background and ground layer
    		this.game.world.setBounds(0, 0, 3500, this.game.height);
    		this.grass = this.add.tileSprite(0,this.game.height-40,this.game.world.width,20,'grass');
    		this.ground = this.add.tileSprite(0,this.game.height-20,this.game.world.width,70,'ground');




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
    		this.barkSound = this.game.add.audio('bark');
    		this.damageSound = this.game.add.audio('damage');
    		var RIGHT = 0, LEFT = 1;/* Divide the current tap x coordinate to half the game.width, floor it and there you go */
    		var $gi = this;

    		this.build_buttons( );
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
          window.location.hash = "";
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



    	// Add a input listener that can help us return from being paused
    	//this.input.onDown.add(this.unpause, self);

      },
      unpause: function() {


      	// Remove the menu and the label
      	this.pause_menu_restart.destroy();
      	this.pause_menu_quit.destroy();

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

      },
      challenge: function() {

    	  this.frozen();
    	  console.log( this.challenges );
    	  //alert('you shall not pass!');
    	  $('#challenge').removeClass('hide');

    	  // templates

        var get_question = function( data ){
    		var q =  data[Math.floor(Math.random() * data.length)];
    		  console.log( data, q );
    		  return q;
        };
      	var current_question = get_question( this.challenges );
      	console.log( current_question );

      	var templates = {
      		"gameover": _.template( $('.templates #gameover').html() ),
      		"question": _.template( $('.templates #aQuestion').html() ),
      		"options": _.template( $('.templates #options').html() ),
      	};
      	$('#challenge').append( templates.question({
      		question: current_question.q,
      		options: current_question.o,
      		answer: current_question.a,
      	}) );

      	var $gi = this;

      	$(document).on('click', 'button[data-value]', function() {
      		var answer = $(document).find('#the_answer').val();

      		console.log( $(this).data('value'), answer);

      		if( $(this).data('value') === answer ) {
      			$(this).addClass('correct');
      			$gi.points += 100;
      			$gi.maxDamage += 1;
      			$gi.refreshStats();
      		} else {
      			$(this).addClass('false');
      			$gi.maxDamage += -1;
      			$gi.refreshStats();
      		}

      		setTimeout(function() {
      			$('#challenge').addClass('hide');
            $('.current-question').remove();
      			$gi.unfrozen();
      		}, 3000);
      	});


      }, // challenge
      update: function() {

      	var $gi = this;

        //collision
        this.game.physics.arcade.collide(this.player, this.ground, this.playerHit, null, this);
        this.game.physics.arcade.collide(this.player, this.aliens, this.playerDamage, null, this);
        this.game.physics.arcade.collide(this.weapon.bullets, this.aliens, this.alienKilled, null, this );
      	this.game.physics.arcade.overlap(this.player, this.hops, this.collectHops, null, this);
      	this.game.physics.arcade.overlap(this.player, this.weapons, this.weaponUp, null, this);

        //only respond to keys and keep the speed if the player is alive
        //we also don't want to do anything if the player is stopped for scratching or digging
        if(this.player.alive && !this.stopped) {

          if( this.wraps % 3 !== 0 && this.challenges_complete !== this.wraps ) {
    	      this.challenges_complete = this.wraps;
    	      this.challenge();

          } else {
            this.player.body.velocity.x = this.default_velocity.x;

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

              //put everything back in the proper order
              //         this.game.world.bringToTop(this.grass);
              //         this.game.world.bringToTop(this.ground);
              this.game.world.bringToTop(this.hops);
              this.game.world.bringToTop(this.buttons);
              this.game.world.bringToTop(this.weapons);

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
    		    this.weapon.fire();
    		    this.refreshStats();

          }


          //The game world is infinite in the x-direction, so we wrap around.
          //We subtract padding so the player will remain in the middle of the screen when
            //wrapping, rather than going to the end of the screen first.
          this.game.world.wrap(this.player, -(this.game.width/2), false, true, false);
        }




      }, // update

    	display_stats : function(){
        var style1 = { font: "20px Arial", fill: "#ff0"};
        var t1 = this.game.add.text(10, 20, "Points:", style1);
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

        this.aliens.remove( alien );
        bullet.kill();
    		this.points += 1;
    		this.refreshStats();
      },
      //the player has just been bitten by a alien
      playerDamage: function(player, alien) {
    	  if(player.body.touching.down && alien.body.touching.up ){
    	    //remove the alien that bit our player so it is no longer in the way
    	    this.points++;
    	    this.refreshStats();
    	    alien.body.velocity.y = 100;
    	    alien.body.velocity.x = 0;
    	  }else{
    	    //remove the alien that bit our player so it is no longer in the way
    	    alien.destroy();

    	    //update our stats
    	    this.damage++;
    	    this.refreshStats();

    			if(this.damage >= this.maxDamage){
    				this.stopped = true;
    				this.player.body.velocity.x = 0;
    				this.player.animations.play('stand', 10, true);
    		    var gO = this.game.add.text((this.game.width / 2) - 50, this.game.height / 2, "Game Over", { font: "20px Arial", fill: "#ff0"});
    		    gO.fixedToCamera = true;

    			  var $gi = this;
    		    $gi.start_new = $gi.game.add.button($gi.game.width  / 2, $gi.world.height  / 2, 'buttons', (function(){}), $gi, 4,4,5);
    		    $gi.start_new.onInputDown.add(function(e ){
    					this.state.start('Game');
    		    }, this);
    				$gi.start_new.fixedToCamera = true;
    		    $gi.start_new.scale.setTo( 1.5, 1.5 );

    				return false;
    			}

    	    //change sprite image
    	    //this.player.loadTexture('playerScratch');
    	    this.player.animations.play('stand', 10, true);

    	    //play audio
    	    this.damageSound.play();

    	    //wait a couple of seconds for the scratch animation to play before continuing
    	    this.stopped = true;
    	    this.player.body.velocity.x = 0;
    	    var $gi = this;
    	    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
    		    this.stopped = false;
    		    $gi.player.animations.play('walk');
    				$gi.player.body.velocity.x = 300;
    	    }, this);


    	  }
      },

      //the player is collecting a toy from a mound
      collectHops: function(player, hop) {
        this.hops.remove( hop );
        hop.kill();
    		this.points += 1;
    		this.refreshStats();
      },
      //the player is collecting a toy from a mound
      weaponUp: function(player, weapon) {
        this.weapons.remove( weapon );
        weapon.kill();
        WS.set_weapon( 'automatic' , this );
      },
    	// you lost. dang.
      gameOver: function() {
        this.game.state.start('Game');
      },
      playerJump: function() {
        //when the ground is a sprite, we need to test for "touching" instead of "blocked"
        if(this.player.body.touching.down) {
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
          var y = this.game.rnd.integerInRange(this.game.height - 100, ( this.game.world.height - this.game.height) -200 );
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
      generateAliens: function() {
        var alien;
        this.aliens = this.game.add.group();

        //enable physics in them
        this.aliens.enableBody = true;

        //phaser's random number generator
    	  this.numAliens += 2;

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
        weapon = this.weapons.create(x, y, 'bullet');
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
  }// END create_game

  function init(){
    //setting game configuration and loading the assets for the loading screen
    GS.game = new Phaser.Game(746, 420, Phaser.CANVAS, 'gameDiv');
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
