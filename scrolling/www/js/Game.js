var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {

    //set up background and ground layer
    this.game.world.setBounds(0, 0, 3500, this.game.height);
    this.grass = this.add.tileSprite(0,this.game.height-50,this.game.world.width,70,'grass');
    this.ground = this.add.tileSprite(0,this.game.height-20,this.game.world.width,70,'ground');
    
    //create player and walk animation
    this.player = this.game.add.sprite(this.game.width/2, this.game.height-90, 'hunter');
    this.player.scale.setTo(1.5,1.5);
  	this.player.animations.add('walk', [4,5], 10, true);
  	this.player.animations.add('stand', [2,3], 3, true);

    this.weapon = this.game.add.weapon(30, 'bullet');
    this.weapon.enableBody = true;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.bulletSpeed = 1000;
    this.weapon.fireRate = 100;
    this.weapon.bulletAngleVariance = 10;
    this.weapon.trackSprite(this.player, 54, -40, true);
    this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    
    //create the aliens
    this.generateAliens();
    //and the toy mounds
    //this.generateMounds();
    
    //put everything in the correct order (the grass will be camoflauge),
    //but the toy mounds have to be above that to be seen, but behind the
    //ground so they barely stick up
    this.game.world.bringToTop(this.grass);
    //this.game.world.bringToTop(this.mounds);
    this.game.world.bringToTop(this.ground);

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
    


    //...or by swiping
    this.swipe = this.game.input.activePointer;

    //sounds
    this.barkSound = this.game.add.audio('bark');
    this.whineSound = this.game.add.audio('whine');
    
    //set some variables we need throughout the game
    this.scratches = 0;
    this.wraps = 0;
    this.points = 0;
    this.wrapping = true;
    this.stopped = false;
    this.maxScratches = 5;
    
    //create an array of possible toys that can be gathered from toy mounds
    //var bone = this.game.add.sprite(0, this.game.height-130, 'bone');
    //var ball = this.game.add.sprite(0, this.game.height-130, 'ball');
    //bone.visible = false;
   //ball.visible = false;
   // this.toys = [bone, ball];
    //this.currentToy = bone;
    
    //stats
    var style1 = { font: "20px Arial", fill: "#ff0"};
    var t1 = this.game.add.text(10, 20, "Kills:", style1);
    var t2 = this.game.add.text(this.game.width-300, 20, "Life:", style1);
    t1.fixedToCamera = true;
    t2.fixedToCamera = true;

    var style2 = { font: "26px Arial", fill: "#00ff00"};
    this.pointsText = this.game.add.text(80, 18, "", style2);
    this.aliensText = this.game.add.text(this.game.width-50, 18, "", style2);
    this.refreshStats();
    this.pointsText.fixedToCamera = true;
    this.aliensText.fixedToCamera = true;

    var RIGHT = 0, LEFT = 1;/* Divide the current tap x coordinate to half the game.width, floor it and there you go */
    var $gi = this;
    this.game.input.onTap.add(function(e){
	    		
/*
		  if (Math.floor(e.x/($gi.game.width/2)) === LEFT) {
			  $gi.playerJump();
			}
*/
			if (Math.floor(e.x/($gi.game.width/2)) === RIGHT) {
			  $gi.playerJump();

			}
/*
*/
		}); 
    

  },
  
  update: function() {
		var $gi = this;
    //collision
    this.game.physics.arcade.collide(this.player, this.ground, this.playerHit, null, this);
    this.game.physics.arcade.collide(this.player, this.aliens, this.playerBit, null, this);
    this.game.physics.arcade.collide(this.weapon.bullets, this.aliens, this.alienKilled, null, this );
   // this.game.physics.arcade.overlap(this.player, this.mounds, this.collect, this.checkDig, this);
    
    //only respond to keys and keep the speed if the player is alive
    //we also don't want to do anything if the player is stopped for scratching or digging
    if(this.player.alive && !this.stopped) {
      
      this.player.body.velocity.x = 300;
      
      //We do a little math to determine whether the game world has wrapped around.
      //If so, we want to destroy everything and regenerate, so the game will remain random
      if(!this.wrapping && this.player.x < this.game.width) {
        //Not used yet, but may be useful to know how many times we've wrapped
        this.wraps++;
        
        //We only want to destroy and regenerate once per wrap, so we test with wrapping var
        this.wrapping = true;
        this.aliens.destroy();
        this.generateAliens();
        //this.mounds.destroy();
        //this.generateMounds();
        
        //put everything back in the proper order
        this.game.world.bringToTop(this.grass);
        //this.game.world.bringToTop(this.mounds);
        this.game.world.bringToTop(this.ground);
      }
      else if(this.player.x >= this.game.width) {
        this.wrapping = false;
      }
      
      //take the appropriate action for swiping up or pressing up arrow on keyboard
      //we don't wait until the swipe is finished (this.swipe.isUp),
      //  because of latency problems (it takes too long to jump before hitting a alien)
      if ( this.cursors.up.isDown) {
        this.playerJump();
      }

      if (( this.swipe.isDown && (this.swipe.positionDown.x > this.game.width / 2)) || this.fireButton.isDown) {
		    this.weapon.fire();
      }

    
      //The game world is infinite in the x-direction, so we wrap around.
      //We subtract padding so the player will remain in the middle of the screen when
        //wrapping, rather than going to the end of the screen first.
      this.game.world.wrap(this.player, -(this.game.width/2), false, true, false);
    }



  },
  //show updated stats values
  refreshStats: function() {
    this.pointsText.text = this.points;
    this.aliensText.text = this.maxScratches - this.scratches;
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
  playerBit: function(player, alien) {
    //remove the alien that bit our player so it is no longer in the way
    alien.destroy();
    
    //update our stats
    this.scratches++;
    this.refreshStats();
    
    //change sprite image
    //this.player.loadTexture('playerScratch');
    this.player.animations.play('stand', 10, true);
    
    //play audio
    this.whineSound.play();
    
    //wait a couple of seconds for the scratch animation to play before continuing
    this.stopped = true;
    this.player.body.velocity.x = 0;
    var $gi = this;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
	    this.stopped = false;
	    $gi.player.animations.play('walk');
			$gi.player.body.velocity.x = 300;
    }, this);
  },
  //the player is collecting a toy from a mound
  collect: function(player, mound) {
    //this is called continuously while player is on mound, but we only want to do it once
    if (!this.stopped) {
      //change image and update the body size for the physics engine
      //this.player.loadTexture('playerDig');
      this.player.animations.play('dig', 10, true);
      this.player.body.setSize(this.player.digDimensions.width, this.player.digDimensions.height);
    
      //we can't remove the toy mound until digging is finished, so we have to set a variable for
      //the function called from the timer (below)
      this.currentMound = mound;
    
      //we stop a couple of seconds for the dig animation to play
      this.stopped = true;
      this.player.body.velocity.x = 0;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.playerDig, this);
    }
  },
  gameOver: function() {
    this.game.state.start('Game');
  },
  //checks to see that the player is swiping down or pressing a down arrow while on a toy mound
  checkDig: function() {
    if (this.cursors.down.isDown || (this.swipe.isDown && (this.swipe.position.y > this.swipe.positionDown.y))) {
      return true;
    }
    else {
      return false;
    }
  },
  playerJump: function() {
    //when the ground is a sprite, we need to test for "touching" instead of "blocked"
    if(this.player.body.touching.down) {
      this.player.body.velocity.y -= 700;
    }    
  },
  playerDig: function() {
    //play audio
    this.barkSound.play();

    //grab the location before we destroy the toy mound so we can place the toy
    var x = this.currentMound.x;
  
    //remove toy the mound sprite now that the toy is collected
    this.currentMound.destroy();
    
    //refresh our points stats
    this.points += 5;
    this.refreshStats();
    
    //randomly pull a toy from the array
    this.currentToy = this.toys[ Math.floor( Math.random() * this.toys.length ) ];
    
    //make the toy visible where the mound used to be
    this.currentToy.visible = true;
    this.currentToy.x = x;
    
    //and make it disappear again after one second
    this.game.time.events.add(Phaser.Timer.SECOND, this.currentToyInvisible, this);
    
    //We switch back to the standing version of the player
    //this.player.loadTexture('dog');
    this.player.animations.play('walk');
    this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
    this.stopped = false;
  },
  currentToyInvisible: function() {
    this.currentToy.visible = false;
  },
  playerScratch: function() {
    this.stopped = false;
    
    if (this.scratches >= 5) {
      //set to dead (even though our player isn't actually dead in this game, just running home)
      //doesn't affect rendering
      this.player.alive = false;
      
      //destroy everything before player runs away so there's nothing in the way
      this.aliens.destroy();
      //this.mounds.destroy();

      //We switch back to the standing version of the player
      //this.player.loadTexture('dog');
      this.player.animations.play('walk', 10, true); //frame rate is faster for running
      this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
      
      //...then run home
      this.player.anchor.setTo(.5, 1);
      this.player.scale.x = -1;
      this.player.body.velocity.x = -1000;

      //we want the player to run off the screen in this case
      this.game.camera.unfollow();

      //go to gameover after a few miliseconds
      this.game.time.events.add(1500, this.gameOver, this);
    } else {
      //change image and update the body size for the physics engine
      //this.player.loadTexture('dog');
      this.player.animations.play('walk', 3, true);
      this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
    }
  },
  generateMounds: function() {
    this.mounds = this.game.add.group();

    //enable physics in them
    this.mounds.enableBody = true;

    //phaser's random number generator
    var numMounds = this.game.rnd.integerInRange(0, 5)
    var mound;

    for (var i = 0; i < numMounds; i++) {
      //add sprite within an area excluding the beginning and ending
      //  of the game world so items won't suddenly appear or disappear when wrapping
      var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
      mound = this.mounds.create(x, this.game.height-75, 'mound');
      mound.body.velocity.x = 0;
    }

  },
  generateAliens: function() {
    this.aliens = this.game.add.group();
    
    //enable physics in them
    this.aliens.enableBody = true;

    //phaser's random number generator
    var numAliens = this.game.rnd.integerInRange(1, 5)
    var alien;

    for (var i = 0; i < numAliens; i++) {
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
  render: function()
    {
        //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");   
    }
};