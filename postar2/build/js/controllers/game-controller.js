angular.module( 'app.controllers' )
.controller( 'GameController', ['$scope', '$http', 'AppService','GameService', 'TriviaService', 'WeaponService', "LeaderBoardService",'$ionicPopup', '$state', '$ionicModal', '$timeout',
function($scope, $http, AS, GS, TS, WS, LBS, $ionicPopup, $state , $ionicModal, $timeout){

  $scope.menu_open = false;

  $ionicModal.fromTemplateUrl('templates/challenge-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.challengeModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/score-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.scoreModal = modal;
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
    		this.gameOver = false;
    		this.mute = true;


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
    		this.shatterSound = this.game.add.audio('shatter');
    		this.tossSound = this.game.add.audio('toss');


        this.music.loopFull(0.6);

    	//this.damageSound = this.game.add.audio('damage');
    		var RIGHT = 0, LEFT = 1;/* Divide the current tap x coordinate to half the game.width, floor it and there you go */
    		var $gi = this;

    		this.build_buttons( );

    		// debug for highscores
    		//this.frozen();
    		//this.saveHighScore();

        //this.challenge();

      },
      pause: function() {

      	// When the paus button is pressed, we pause the game
      	//this.pause_label = this.add.text(this.w/2, 100, 'Resume', { font: '24px Arial', fill: '#fff' });
      	//this.pause_label.setText('Resume');

      	this.paused = true;
      	this.stopped = true;
      	this.player.body.velocity.x = 0;
      	this.player.animations.play('stand', 10, true);

/*
      	// Then add the menu
      	this.pause_menu_restart = this.add.text(this.w/2, 48, 'Restart', { font: '24px Arial', fill: '#fff' });
      	this.pause_menu_restart.inputEnabled = true;
      	this.pause_menu_restart.fixedToCamera = true;
      	this.pause_menu_restart.events.onInputUp.add( function() { this.state.start('Game'); }, this);
*/

/*
      	this.pause_menu_quit = this.add.text(this.w/2, 72, 'Quit', { font: '24px Arial', fill: '#fff' })
      	this.pause_menu_quit.inputEnabled = true;
      	this.pause_menu_quit.fixedToCamera = true;
      	this.pause_menu_quit.events.onInputUp.add( function() {
          //this.create();
          this.game.sound.mute = true;

          window.location.hash = "";
        }, this);
*/

//         this.pause_menu_sound = this.add.text(this.w/2, 112, 'Sound On', { font: '24px Arial', fill: '#fff' });
/*
      	if( this.game.sound.mute === false ) {
             this.pause_menu_sound.setText('Sound On');
          } else {
            this.pause_menu_sound.setText('Sound Off');
          }
*/

/*
      	this.pause_menu_sound.inputEnabled = true;
      	this.pause_menu_sound.fixedToCamera = true;
*/
/*
      	this.pause_menu_sound.events.onInputUp.add( function() {
          if( this.game.sound.mute === false ) {
             this.game.sound.mute = true;
             this.pause_menu_sound.setText('Sound Off');

          } else {
            this.game.sound.mute = false;
            this.pause_menu_sound.setText('Sound On');
          }


        }, this);
*/


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
      toggle_sound : function(){
        if( this.game.sound.mute === false ) {
           this.game.sound.mute = true;
        } else {
          this.game.sound.mute = false;
        }
      },
      // restart the game
      restart: function(){
        this.state.start('Game');
      },

      unpause: function() {


/*
      	// Remove the menu and the label
      	this.pause_label.setText('Pause');
      	this.pause_menu_restart.destroy();
      	this.pause_menu_quit.destroy();
      	this.pause_menu_sound.destroy();
*/

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
      			$scope.my_answer = false;
      			$scope.current_question = false;
    			}, 1500);

    		}, 500);
      },
      // show the challenge window.
      challenge: function() {
        var $gi = this;
       if( ( this.player.body.touching.right ) && this.challenging !== true && this.maxDamage - this.damage >= 1 ){
    			$scope.answered_correct = false;
          this.challenging = true;
      	  this.frozen();
          $scope.challengeModal.show();
        	$scope.current_question = TS.get_question(  );
        }// if challenge
      }, // challenge
      // general update function
      update: function() {

      	var $gi = this;

        //collision
        this.game.physics.arcade.collide(this.player, this.ground, this.playerHit, null, this);
        this.game.physics.arcade.collide(this.player, this.aliens, this.playerDamage, function(player, alien){ return alien.alive; }, this);
        this.game.physics.arcade.collide(this.weapon.bullets, this.aliens, this.alienKilled, null, this );
        this.game.physics.arcade.collide(this.weapon.bullets, this.ground, this.shatter, null, this );
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
    		    this.tossSound.play();
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
        this.game.physics.arcade.overlap(this.weapon.bullets, this.castles, this.shatter, null, this );

        //castle.body.stopVelocityOnCollide = false;

      }, // add the castle after checking wraps

    	display_stats : function(){
/*
        var style1 = { font: "20px Arial", fill: "#ff0"};
        var t1 = this.game.add.text(10, 20, "Score:", style1);
        t1.fixedToCamera = true;
        var t2 = this.game.add.text(this.game.width-100, 20, "Life:", style1);
        t2.fixedToCamera = true;

        var t3 = this.game.add.text(this.game.width-220, 20, "Shots:", style1);
        t3.fixedToCamera = true;


        var style2 = { font: "26px Arial", fill: "#00ff00"};
*/
/*
        this.pointsText = this.game.add.text(80, 18, "", style2);
        this.aliensText = this.game.add.text(this.game.width-50, 18, "", style2);
        this.shotsText = this.game.add.text(this.game.width-150, 18, "1", style2);
*/
        this.refreshStats();
/*
        this.pointsText.fixedToCamera = true;
        this.aliensText.fixedToCamera = true;
        this.shotsText.fixedToCamera = true;
*/
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

        $gi.buttons.up = $gi.game.add.button(4, $gi.world.height - 68, 'buttons', (function(){}), $gi, 3,3,2);
        $gi.buttons.up.onInputUp.add(function(e ){
    			$gi.playerJump();
        }, this);
        $gi.buttons.up.onInputDown.add(function(e ){
    			$gi.playerJump();
        }, this);
    		$gi.buttons.up.fixedToCamera = true;
        $gi.buttons.up.scale.setTo( .5, .5 );
        $gi.buttons.up.onInputDown.add(function(e ){ }, this);
        $gi.buttons.up.onInputUp.add(function(){ }, this);

        $gi.buttons.fire = $gi.game.add.button($gi.game.width - 68, $gi.world.height - 68 , 'buttons', (function(){}), $gi, 0,0,1);
        $gi.buttons.fire.onInputDown.add(function(e ){
    	    this.tossSound.play();
    			$gi.weapon.fire();
        }, this);
        $gi.buttons.fire.onInputUp.add(function(e ){
    	    this.firing = false;
        }, this);
    		$gi.buttons.fire.fixedToCamera = true;
        $gi.buttons.fire.scale.setTo( .5, .5 );
        $gi.buttons.fire.onInputDown.add(function(e ){ }, this);
        $gi.buttons.fire.onInputUp.add(function(){ }, this);

/*
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
*/

      },

      //show updated stats values
      refreshStats: function() {
        this.pointsText = this.points;
        this.damageText = this.maxDamage - this.damage;
        this.shotsText = this.weapon.fireLimit -  this.weapon.shots;
        if(!$scope.$$phase) $scope.$apply();
      },
      playerHit: function(player, blockedLayer) {
        if(player.body.touching.right) {
          //can add other functionality here for extra obstacles later
        }
      },
      shatter: function(obstacle, bullet) {
        this.shatterSound.play();
        bullet.destroy();
      },
      alienKilled : function(bullet, alien){
        this.explodeSound.play();
        alien.play( 'die')
        alien.alive = false;
        //alien.body.moves = false;
        //this.aliens.remove( alien );
        bullet.kill();
    		this.points += 1;
    		this.refreshStats();
      },
      //the player has just been bitten by a alien
/*
      died: function() {

      },
*/
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
/*
    		    var gO = this.game.add.text((this.game.width / 2) - 50, this.game.height / 2 - 90, "Game Over", { font: "24px arcadeclassicregular", fill: "#ff0"});
    		    gO.fixedToCamera = true;
*/
/*
    		    gO.inputEnabled = true;
            gO.events.onInputUp.add( function() {
                this.state.start('Game');
            }, this);
*/

/*
            var again = this.game.add.text((this.game.width / 4) - 50, this.game.height / 2, "Play Again", { font: "20px Arial", fill: "#ff0"});
    		    again.fixedToCamera = true;
    		    again.inputEnabled = true;
            again.events.onInputUp.add( function() {
                this.state.start('Game');
            }, this);
*/

/*
            var score = this.game.add.text((this.game.width / 2) + 50, this.game.height / 2, "Your Score: " + this.points, { font: "20px Arial", fill: "#ff0"});
    		    score.fixedToCamera = true;

    		    console.log( 'GO: ' + this.points );
*/


/*
    			  var $gi = this;
    		    $gi.start_new = $gi.game.add.button($gi.game.width  / 2, $gi.world.height  / 2, 'buttons', (function(){}), $gi, 4,4,5);
    		    $gi.start_new.onInputDown.add(function(e ){
    					this.state.start('Game');
    		    }, this);
    				$gi.start_new.fixedToCamera = true;
    		    $gi.start_new.scale.setTo( 1.5, 1.5 );
*/
            this.gameOver = true;
            if(!$scope.$$phase) $scope.$apply();

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
      submitHighScore: function() {
        LBS.saveScore( $scope.game.initials, $scope.game.points ).then(function(){
          $scope.game.highScoreSaved = true;
          $timeout(function(){
            $scope.game.closeScoreModal();
          }, 1000)
        });


      },
      // close the score modal + reset the saved status
      closeScoreModal: function( $goto ){
        $goto = $goto || false;
        $scope.game.highScoreSaved = true;
        $scope.scoreModal.hide().then(function(){
          if($goto ) $state.go($goto );
        })
      },
      // let the user save their score
      saveHighScore : function(){
         $scope.highScores = LBS.leaders;
         $scope.scoreModal.show();
/*
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
*/
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
/*
      gameOver: function() {
        this.music.stop();
        this.gameOverSound.play();
        this.game.state.start('Game');
      },
*/
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
      // add the enemies
      generateAliens: function() {
        var alien;
        this.aliens = this.game.add.group();
        this.aliens.enableBody = true;
    	  this.numAliens += 1;
        for (var i = 0; i < this.numAliens; i++) {
          var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
          var y = this.game.rnd.integerInRange(this.game.height - 100, this.game.world.height - this.game.height );



          alien = this.aliens.create(x, y, 'alien');
          alien.alive = true;
    			alien.animations.add('die', null, 10);
          alien.body.velocity.x = this.game.rnd.integerInRange(-20, 0);
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
        weapon.body.immovable = true;
        weapon.body.collideWorldBounds = false;
      },

      render: function() {
        //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
      },
      restart: function(){
        this.state.start('Game');
      },
      pause_and_show_menu: function(){
        $scope.menu_open = $scope.menu_open ? false : true;
        this.pause();
      },
      resume : function(){
        $scope.menu_open = false;
        this.unpause();
      },
      quit : function(){
        this.game.sound.mute = true;
        $state.go('app')
      }
    }// END GAME
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
