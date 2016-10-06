angular.module('app.services')

.service( 'WeaponService', [function(){

  var weapons = {
    //
    get_weapons  : function(){
     var $si = this;
     this.weapons = [
        { "id" : "grenade",
			    "fireRate" : 700,
			    "fireLimit" : 20,
			    "bulletSpeed": 500,
			    "bulletAngleVariance" : 10,
			    "fireAngle": '345',
			    "automatic" : false,
			    "bulletGravity": new Phaser.Point(600, 600),
			    "bulletRotateToVelocity": true
		    },
		    { "id" : "single",
			    "fireRate" : 700,
			    "fireLimit" : 50,
			    "fireAngle": '0',
			    "bulletAngleVariance" : 0,
			    'automatic': false,
			    "bulletGravity": new Phaser.Point(0,0),
			    "bulletSpeed": 1000
		    },
		    { "id" : "automatic",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 0,
			    "automatic" : true,
			    "bulletSpeed": 1000
		    },
		    { "id" : "automatic_spread",
			    "fireRate" : 100,
			    "fireLimit" : 100,
			    "bulletAngleVariance" : 10,
			    "automatic" : true,
		    }
		  ]
		  // save the keys for access
		  this.weaponKeys = [];
		  _.each( this.weapons, function(w){
  		  $si.weaponKeys.push( w.key );
		  });
		  return this.weapons;
    },
    get_random : function(){
      var rand = Math.ceil(Math.random(0, this.weaponKeys.length ));
      return this.weapons[ rand ] ;
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
      //$gi.weapon.bulletSpeed = 1000;


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

      //$gi.weapon.bulletGravity = -1000;

      $gi.weapon.trackSprite($gi.player, 54, -40, false);
      //$gi.weapon.fireRate = 1000;
      $gi.fireButton = $gi.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
      $gi.fireButton.onDown.add(function(e ){
  	    //console.log( e )
  			$gi.weapon.fire();
      }, $gi);
  	  $gi.weapon.resetShots();
    }
  };
  return weapons
}]);
