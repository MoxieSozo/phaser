(function(){

  var app = angular.module('starter')


  app.controller('gameController', ['$interval' , function( $interval ){

    var $ctrl = this;
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gameDiv')
    var mainState = {}
    var player

    mainState.preload =  function() {
      game.load.spritesheet('dude', 'assets/img/astronaut.png', 40, 40);
      game.load.image('brick', 	'assets/img/brick.png');
      game.load.spritesheet('buttons', 	'assets/img/buttons.png', 32, 32);

  		//full screen
  		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  		this.jump_strength = 1;

    };

    mainState.create =  function() {
  		game.stage.backgroundColor = "#FFFFFF";
  		build_world( this );
  		add_dude( this );
    };

    mainState.hit = function(ball, brick){
    }

    mainState.update =  function() {
      update_dude( this );

    };

    function add_dude( $gi ){
      var player =  game.add.sprite(100, 100, 'dude');

  		game.physics.arcade.enable(player);
  		player.body.bounce.y = 0.1;
  		player.body.gravity.y = 600;
  		player.body.collideWorldBounds = true;
  		player.scale.setTo(2,2);

  		//	Walking animations
  		player.animations.add('standing', [4,5], 3, false );
  		player.animations.add('left', [0, 1], 10, true );
  		player.animations.add('right', [6,7], 10, true);

      $gi.player = player;
      $gi.cursors = game.input.keyboard.createCursorKeys();
      build_buttons( $gi );
    }

    function build_buttons( $gi ){
      $gi.left  = false;
      $gi.right = false;
      $gi.jump  = false;
      $gi.buttons = {};
      var down_timer = false;
      var down = false;
      var jump_strength = 1;
      var accel = .01;
      $gi.buttons.up = game.add.button(game.world.width - 100, game.world.height - 95, 'buttons', (function(){}), this, 4,4,5);
      $gi.buttons.up.scale.setTo( 1.5, 1.5 );
      $gi.buttons.up.onInputDown.add(function(e ){
  			$gi.player.animations.stop();
  			$gi.player.frame = 4;
        down = true;
        down_timer = $interval(function(){
          $gi.jump_strength += .1;
          console.log( jump_strength);
        }, 100);
      }, this);
      $gi.buttons.up.onInputUp.add(function(){
        var down = false;
        $interval.cancel( down_timer );
        down_timer = false;
  			$gi.player.frame = 5;
        $gi.up = true;
      }, this);

      $gi.buttons.left = game.add.button( 20, game.world.height - 95, 'buttons', (function(){}), this, 0, 0, 1);
      $gi.buttons.left.scale.setTo( 1.5, 1.5);
      $gi.buttons.left.onInputDown.add(function(){$gi.left = true; }, $gi);
      $gi.buttons.left.onInputUp.add(function(){$gi.left = false; }, $gi);

      $gi.buttons.right = game.add.button( 100, game.world.height - 95, 'buttons', (function(){}), this, 2, 2, 3);
      $gi.buttons.right.scale.setTo( 1.5, 1.5);
      $gi.buttons.right.onInputDown.add(function(){$gi.right = true; }, $gi);
      $gi.buttons.right.onInputUp.add(function(){$gi.right = false; }, $gi);

/*

      $gi.button = game.add.button( 100, game.world.height - 100, 'button', (function(){}), this, 2, 1, 0);
      $gi.button.onInputOut.add(function(){$gi.up = false}, this);
      $gi.button.onInputUp.add(function(){$gi.up = true; console.log( $gi.up)}, this);
*/


    }

    function update_dude( $gi ){
  		game.physics.arcade.collide($gi.player, $gi.platforms);
  		if ($gi.cursors.left.isDown || $gi.left ) {
  			//	Move to the left
  			$gi.player.body.velocity.x = -150;
  			$gi.player.animations.play('left');

  		} else if ($gi.cursors.right.isDown || $gi.right ) {
  			//	Move to the right
  			$gi.player.body.velocity.x = 150;
  			$gi.player.animations.play('right');
  		} else {
    		if(! $gi.cursors.up.isDown){
      		console.log( 'standing' )
    			//	Stand still
    			$gi.player.body.velocity.x = 0;
    			$gi.player.animations.play('standing');
    		}

  		}

      if( ( $gi.cursors.up.isDown || $gi.up )  && $gi.player.body.touching.down ) {
        $gi.player.animations.stop();
        $gi.up = false;
        console.log( $gi.jump_strength)
        $gi.player.body.velocity.y = ($gi.jump_strength * 450 ) * -1;
        $gi.jump_strength = 1;
      }

/*
  		//	Allow the player to jump if they are touching the ground.
  		if ( ($gi.cursors.up.isDown  && $gi.player.body.touching.down) ||  $gi.jump ) $gi.player.body.velocity.y = -450;
*/

    }


    function build_world( $gi ){
      //game.world.setBounds(0, 0, game.world.width, 5000);
      createPlatforms( $gi );

    }

    function createPlatforms( $gi ){
      var platforms = game.add.group();
      platforms.enableBody = true;
      for( var i = 0;i < game.world.width;i+=64){
    		var ground = platforms.create(i, game.world.height - 100, 'brick');
    		ground.body.immovable = true;
      }
      for( var i = 0;i < ( game.world.width / 2 ) ;i+=64){
    		var ground = platforms.create(i, game.world.height - 240 , 'brick');
    		ground.body.immovable = true;
      }
      for( var i = 0;i < ( game.world.width / 2 ) ;i+=64){
    		var ground = platforms.create(i + ( game.world.width / 2 ), game.world.height - 460 , 'brick');
    		ground.body.immovable = true;
      }
      for( var i = 0;i < ( game.world.width / 2 ) ;i+=64){
    		var ground = platforms.create(i , game.world.height - 680 , 'brick');
    		ground.body.immovable = true;
      }
      $gi.platforms = platforms;

    }


    function init(){
      game.state.add('main', mainState);
      game.state.start('main');
    }

    init();



  }])// gam-controller;


})();
