var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function(){};

InfiniteScroller.Preload.prototype = {
  preload: function() {
    //show loading screen

    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/kenney.png');
		this.load.image('bullet', 'assets/images/bullet.png');
		
    this.load.spritesheet('hunter', 'assets/images/astronaut.sprite.png', 50, 50);
	  this.game.load.spritesheet('coin', 'assets/images/coin.png', 32, 32);
		
  },
  create: function() {
    this.state.start('Game');
  }
};