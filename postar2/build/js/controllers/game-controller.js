angular.module( 'app.controllers' )
.controller( 'GameController', ['$scope', '$http', 'AppService','GameService', 'TriviaService',
function($scope, $http, AS, GS, TS){

  function create_game(){
    GS.Game = {
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
    		var playerDigImg = this.game.cache.getImage('playerDig');
    		this.player.animations.add('dig');
    		this.player.digDimensions = {width: playerDigImg.width, height: playerDigImg.height};

    		var playerScratchImg = this.game.cache.getImage('playerScratch');
    		this.player.animations.add('scratch');
    		this.player.scratchDimensions = {width: playerScratchImg.width, height: playerScratchImg.height};

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
    		this.whineSound = this.game.add.audio('whine');
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
      	this.pause_menu_quit.events.onInputUp.add( function() { window.location = "http://google.com"; }, this);

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

    		this.weaponOptions = [
    		    { "id" : "single",
    			    "fireRate" : 100,
    			    "fireLimit" : 100,
    			    "bulletAngleVariance" : 0,
    			    'automatic': false

    		    },
    		    { "id" : "automatic",
    			    "fireRate" : 100,
    			    "fireLimit" : 100,
    			    "bulletAngleVariance" : 10,
    			    "automatic" : true,
    		    },
    		    { "id" : "automatic_spread",
    			    "fireRate" : 100,
    			    "fireLimit" : 100,
    			    "bulletAngleVariance" : 10,
    			    "automatic" : true,
    		    },
    		  ]

        this.set_weapon(0);


      }, // create_weapons
      set_weapon : function( key ){

    		$gi = this;
        this.weapon = this.game.add.weapon(30, 'bullet');
        this.weapon.enableBody = true;
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        this.weapon.bulletAngleOffset = 90;
        this.weapon.bulletSpeed = 1000;
        if(typeof ( key ) === 'string' ){
    			var option =  _.find( this.weaponOptions, function( o ){
    			  return o.id === key;
    		  });
    		}
        if(typeof ( key ) === 'number' ) option = this.weaponOptions[key];

    	  this.currentWeapon = option;
    	  _.each( option, function ( o , k ){
    		  $gi.weapon[k] = o;
    	  })
    /*

        this.weapon.fireRate = 100;
        this.weapon.fireLimit = 10;
        this.weapon.bulletAngleVariance = 10;
    */

        this.weapon.trackSprite(this.player, 54, -40, true);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.fireButton.onDown.add(function(e ){
    	    console.log( e )
    			this.weapon.fire();
        }, this);
    	  this.weapon.resetShots();

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
    	  if(player.body.touching.down){
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
    	    this.whineSound.play();

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
        this.set_weapon( 'automatic' );
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
