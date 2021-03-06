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
        this.load.spritesheet('explode', 'assets/images/explode.png', 50,100);
        this.load.spritesheet('buttons', 	'assets/images/buttons.png', 128, 128);
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
        this.load.image('alien', 'assets/images/alien.png');


        this.load.audio('blip', ['assets/audio/blip.wav']);
        this.load.audio('explosion', ['assets/audio/explosion.wav']);
        this.load.audio('fail', [ 'assets/audio/fail.wav']);
        this.load.audio('game-over', [ 'assets/audio/fail.wav']);
        this.load.audio('hurt', [ 'assets/audio/hurt.wav']);
        this.load.audio('jump', [ 'assets/audio/jump.wav']);
        this.load.audio('lazer', [ 'assets/audio/lazer.wav']);
        this.load.audio('life', [ 'assets/audio/life.wav']);
        this.load.audio('level-up', [ 'assets/audio/level-up.wav']);
        this.load.audio('shatter', [ 'assets/audio/shatter.wav']);
        this.load.audio('soundtrack', [ 'assets/audio/soundtrack.wav']);
        this.load.audio('toss', [ 'assets/audio/toss.wav']);



        //this.load.audio('bark', ['assets/audio/bark.ogg', 'assets/audio/bark.mp3']);

        //this.load.image('mound', 'assets/images/rock.png');

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
