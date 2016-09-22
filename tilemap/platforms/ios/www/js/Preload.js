var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function(){};

InfiniteScroller.Preload.prototype = {
  preload: function() {
    //show loading screen

		this.load.tilemap( 'level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image( 'gameTiles', 'assets/images/tiles_spritesheet.png');
  },
  create: function() {
    this.state.start('Game');
  }
};