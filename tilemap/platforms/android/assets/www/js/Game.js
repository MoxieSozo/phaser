var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
  },
  create: function() {
		this.map.addTilesetImage('level1', 'gameTiles');
  },
  update: function() { },
};