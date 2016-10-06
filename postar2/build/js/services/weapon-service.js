angular.module('app.services')

.service( 'WeaponService', [function(){

  var weapons = {
    //
    get_weapons  : function(){

     this.weapons = [
		    { "id" : "single",
			    "fireRate" : 100,
			    "fireLimit" : 50,
			    "bulletAngleVariance" : 0,
			    'automatic': false

		    },
		    { "id" : "automatic",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 0,
			    "automatic" : true,
		    },
		    { "id" : "automatic_spread",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 10,
			    "automatic" : true,
		    },
		  ]
		  return this.weapons;
    },
    // set a weapon by key or index
    // accepts the key and the context ( this / game )
    set_weapon : function( key , context  ){
      var weapons = this.get_weapons();
      var $gi = context
      $gi.weapon = $gi.game.add.weapon(30, 'bullet');
      $gi.weapon.enableBody = true;
      $gi.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
      $gi.weapon.bulletAngleOffset = 90;
      $gi.weapon.bulletSpeed = 1000;
      if(typeof ( key ) === 'string' ){
  			var option =  _.find( weapons, function( o , k ){
    			if(o.id === key ) $gi.currentWeaponIndex = k;
  			  return o.id === key;
  		  });
  		}
      if(typeof ( key ) === 'number' ) {
        $gi.currentWeaponIndex = key;
        option = weapons[key];
      }

  	  $gi.currentWeapon = option;
  	  _.each( option, function ( o , k ){
  		  $gi.weapon[k] = o;
  	  })


      $gi.weapon.trackSprite($gi.player, 54, -40, true);
      $gi.fireButton = $gi.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
      $gi.fireButton.onDown.add(function(e ){
  	    console.log( e )
  			$gi.weapon.fire();
      }, $gi);
  	  $gi.weapon.resetShots();
    }
  };
  return weapons
}]);
