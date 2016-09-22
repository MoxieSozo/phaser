(function(){

  var app = angular.module('starter')


  app.controller('gameController', [function(){

    var $ctrl = this;
    var game = new Phaser.Game(window.innerHeight, window.innerWidth, Phaser.AUTO, 'gameDiv')
    var mainState = {}

    mainState.preload =  function() {
      game.load.image( 'paddle', 'assets/paddle.png');
      game.load.image( 'brick', 'assets/brick.png');
      game.load.image( 'ball', 'assets/ball.png');
    };

    mainState.create =  function() {
      game.stage.backgroundColor = '#336699';
      game.physics.startSystem( Phaser.Physics.ARCADE );
      game.world.enableBody = true;
      this.left = game.input.keyboard.addKey( Phaser.Keyboard.LEFT );
      this.right = game.input.keyboard.addKey( Phaser.Keyboard.RIGHT );
      this.up = game.input.keyboard.addKey( Phaser.Keyboard.UP );
      this.down = game.input.keyboard.addKey( Phaser.Keyboard.DOWN );
      add_paddle( this );
      add_bricks( this );
      add_ball( this );
    };

    mainState.hit = function(ball, brick){
      brick.kill();
    }

    mainState.update =  function() {
      if( this.left.isDown) this.paddle.body.velocity.x = -300;
      else if( this.right.isDown) this.paddle.body.velocity.x = 300;
      else this.paddle.body.velocity.x = 0;

      if( this.up.isDown) this.paddle.body.velocity.y = -300;
      else if( this.down.isDown) this.paddle.body.velocity.y = 300;
      else this.paddle.body.velocity.y = 0;

      game.physics.arcade.collide(this.paddle, this.ball);
      game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
      if (this.ball.y > this.paddle.y) game.state.start('main');
    };

    function add_paddle( $gi ){
      $gi.paddle = game.add.sprite( window.innerWidth / 4 , window.innerHeight - 200, 'paddle');
      $gi.paddle.body.immovable = true;
    }
    function add_bricks( $gi ){
      // Create a group that will contain all the bricks
      $gi.bricks = game.add.group();

      // Add 25 bricks to the group (5 columns and 5 lines)
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          // Create the brick at the correct position
          var brick = game.add.sprite(100+i*55, 50+j*30, 'brick');

          // Make sure the brick won't move when the ball hits it
          brick.body.immovable = true;

          // Add the brick to the group
          $gi.bricks.add(brick);
        }
      }
    }

    function add_ball($gi){
      // Add the ball
      $gi.ball = game.add.sprite(window.innerWidth / 4, window.innerHeight - 400, 'ball');

      // Give the ball some initial speed
      $gi.ball.body.velocity.x = 200;
      $gi.ball.body.velocity.y = 200;

      // Make sure the ball will bounce when hitting something
      $gi.ball.body.bounce.setTo(1);
      $gi.ball.body.collideWorldBounds = true;

    }

    function init(){
      game.state.add('main', mainState);
      game.state.start('main');
    }

    init();



  }])// gam-controller;


})();
