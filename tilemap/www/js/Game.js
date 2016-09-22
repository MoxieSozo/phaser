var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
  },
  create: function() {
	  
	  this.gravity = 600;

    this.map = this.game.add.tilemap('level1');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('kenney', 'gameTiles');

    //create layers
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.groundLayer = this.map.createLayer('GroundLayer');


    //collision on blockedLayer
    this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

		this.player = this.game.add.sprite(100.,this.game.height-200, 'hunter');
		this.player.animations.add('standing', [2,3], 3, true );
		this.player.animations.add('left', [0,1], 10, true );
		this.player.animations.add('right', [4,5], 10, true);
		this.player.animations.add('jump_left', [8], 10, true);
		this.player.animations.add('jump_right', [6], 10, true);
		this.player.animations.play('standing');

		this.game.physics.arcade.enable(this.player);
		this.player.body.bounce.y = 0.1;
		this.player.body.gravity.y = this.gravity;
  	this.player.body.collideWorldBounds = true;

    this.weapon = this.game.add.weapon(30, 'bullet');
    this.weapon.enableBody = true;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.bulletSpeed = 1000;
    this.weapon.fireRate = 100;
    //this.weapon.bulletAngleVariance = 10;
    this.weapon.fireAngle = 270;
    this.weapon.bulletWorldWrap = true;
    this.weapon.trackSprite(this.player, 65, 25, true);
    this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

	
	
		this.game.camera.follow( this.player );
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		
		this.animation = 'standing';

    //  Here we create our coins group
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
/*
		
		this.platform = this.game.add.group();
		this.platform.enableBody = true;
    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    this.map.createFromObjects('objectLayer', 72, 'coin', 0, true, false, this.coins);
*/

    //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    this.map.createFromObjects('GroundLayer', 72, 'coin', 0, true, false, this.platform);


    //  Add animations to all of the coin sprites
    this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
    this.coins.callAll('animations.play', 'animations', 'spin');
    

    var style1 = { font: "20px Arial", fill: "#ff0"};
    var t1 = this.game.add.text(10, 20, "Hops:", style1);
    var t2 = this.game.add.text(this.game.width-300, 20, "Life:", style1);
    t1.fixedToCamera = true;
    t2.fixedToCamera = true;
    var style2 = { font: "26px Arial", fill: "#00ff00"};
    this.pointsText = this.game.add.text(80, 18, "", style2);
    this.aliensText = this.game.add.text(this.game.width-50, 18, "", style2);
    this.pointsText.fixedToCamera = true;
    this.aliensText.fixedToCamera = true;

		this.maxHits = 10;
		this.hits = 0;
		this.points = 0;
    this.refreshStats();
    
    this.facing = 'front'
    this.jumping = false;
		
  },
  collectCoins: function(player, coin){
	  this.coins.remove(coin);
		this.points += 1;
		this.refreshStats();
  },
  //show updated stats values
  refreshStats: function() {
    this.pointsText.text = this.points;
    this.aliensText.text = this.maxHits - this.hits;
  },
  update: function() { 
	  
	  //this.game.physics.arcade.collide( this.player, this.blockedLayer);
	  this.game.physics.arcade.collide( this.player, this.groundLayer )
    this.game.physics.arcade.overlap( this.player, this.coins, this.collectCoins, null, this );
	  
	  if(this.cursors.left.isDown){
		  this.player.body.velocity.x = -300;
		  this.animation = 'left'
		  this.facing = 'left';
	  }
	  else if(this.cursors.right.isDown){
		  this.player.body.velocity.x = 300;
		  this.animation = 'right'
		  this.facing = 'right';
	  }
	  // slow down
	  if(!this.cursors.right.isDown &&  this.player.body.velocity.x > 0){
		  this.player.body.velocity.x -= 10;
	  }
	  if(!this.cursors.left.isDown &&  this.player.body.velocity.x < 0){
		  this.player.body.velocity.x += 10;
	  }
	  if(this.player.body.velocity.x == 0 && this.player.body.velocity.y <= 0){
		  this.animation = 'standing'
	  }
    if(this.cursors.up.isDown) {
	    if(this.player.body.blocked.down) {
	      this.player.body.velocity.y -= 650;
	      this.jumping = true;
	    }
    }
    
/*
	  if(this.facing == 'right' && this.player.body.velocity.y > 0){
		  this.animation = 'jump_right'
	  }
	  if(this.facing == 'right'  && this.player.body.velocity.y >  0){
		  this.animation = 'jump_left'
	  }
*/
	  
    this.player.play( this.animation )


    if ( this.fireButton.isDown && !this.standing) {
	    this.weapon.fire();
    }

	  
  },
  playerJump: function(){
  }
};