/**
 * @author AdamTavares / http://adamtavares.com
 */
var LSYS = LSYS || { REVISION: '1' }

/**
 * The L-System generator
 */
LSYS.Sys = function( _iter, _angle, _start ) {

	this.iter = _iter;			// {int} The total number of iterations.
	this.angle = _angle;		// {float} The angle.
	this.start = _start;		// {string} The starting state
	this.rules = {};			// {object} The rules of the L-System. 
	
	//------------------------------------------------------------
	//	Generated by the program
	//------------------------------------------------------------
	this.n = 0;					// {int}  The current iteration.
	this.output = this.start;	// {string} The string which becomes a output with the help of a renderer
	
	//------------------------------------------------------------
	//	Everything after the 3rd parameter is a rule
	//------------------------------------------------------------
	for ( var i=3; i<arguments.length; i++ ) {
		var map = arguments[i].split('=');
		this.rules[map[0]] = map[1];
	}
}

LSYS.Sys.prototype.draw = function( _renderer, _color ) {
	_renderer.draw( this.output, this.angle, _renderer );
	var self = this;
	window.addEventListener( 'resize', function( _event ) {
		self.windowResize( _renderer );
	});
}

LSYS.Sys.prototype.windowResize = function( _renderer, _timer ) {
	var self = this;
	if ( _timer != undefined ) {
		clearTimeout( _timer );
	}
	_timer = setTimeout( function() { 
		self.reset( _renderer );
	}, 0 );
}

LSYS.Sys.prototype.reset = function( _renderer ) {
	var self = this;
	_renderer.ctx.clearRect( 0 ,0, _renderer.canvas.width, _renderer.canvas.height );
	_renderer.draw( self.output, self.angle, true );
}

LSYS.Sys.prototype.run = function() {
	while ( this.n < this.iter ) {
		this.next();
		this.n++;
	}
}

LSYS.Sys.prototype.next = function() {
	//------------------------------------------------------------
	//	Apply next rule
	//------------------------------------------------------------
	var chars = this.output.split('');
	for ( var i in chars ) {
		if ( chars[i] in this.rules ) {
			chars[i] = this.rules[ chars[i] ];
		}
	}
	this.output = chars.join('');
}

LSYS.Renderer = function( _canvas ) {
	this.canvas = _canvas;
	this.constants = {
		'+': 'COUNTERCLOCK',
		'-': 'CLOCKWISE',
		'[': 'PUSH',
		']': 'POP',
		'C': 'COLOR'
	};
}

//------------------------------------------------------------
//	2D renderer class
//------------------------------------------------------------
LSYS.TwoD = function( _canvas, _options ){
	LSYS.Renderer.call( this, _canvas );
	this.ctx = this.canvas.getContext('2d');
	this.options = ( _options == undefined ) ? {} : _options;
	this.options['delay'] = ( this.options['delay'] == undefined ) ? 0 : this.options['delay'];
	self.i = 1;
}

LSYS.TwoD.prototype = Object.create( LSYS.Renderer.prototype );

LSYS.TwoD.prototype.draw = function( _input, _angle, _reset ) {
	//------------------------------------------------------------
	//	Get the coordinates with unit distance
	//------------------------------------------------------------
	var angle = _angle;
	var x = 0;
	var y = 0;
	var maxX = 0;
	var maxY = 0;
	var minX = 0;
	var minY = 0;
	coords = [];
	coords.push( [x,y] );
	
	//------------------------------------------------------------
	//	Loop through the LSys input string
	//------------------------------------------------------------
	var chars = _input.split('');
	for ( var i in chars ) {
		if ( chars[i] in this.constants ) {
			switch ( this.constants[ chars[i] ] ) {
				case 'COUNTERCLOCK':
					angle += _angle;
					break;
				case 'CLOCKWISE':
					angle -= _angle;
					break;
			}
		}
		else {
			var vector = Math.toCart( 1, Math.toRad( angle ) );
			x += vector[0];
			y += vector[1];
			coords.push( [x,y] );
			
			//------------------------------------------------------------
			//	Keep track of the biggest and smallest coordinates so 
			//	we can determine the boundary box of the image
			//------------------------------------------------------------
			maxX = ( x > maxX ) ? x : maxX;
			maxY = ( y > maxY ) ? y : maxY;
			minX = ( x < minX ) ? x : minX;
			minY = ( y < minY ) ? y : minY;
		}
	}
	
	//------------------------------------------------------------
	//	Get the values you need to nudge the shape in place
	//------------------------------------------------------------
	var nudgeX = ( minX < 0 ) ? minX*-1 : 0;
	var nudgeY = ( minY < 0 ) ? minY*-1 : 0;	
	
	//------------------------------------------------------------
	//	Scale the thing up to the size of the canvas
	//------------------------------------------------------------
	var rx = this.canvas.width / ( maxX + nudgeX );
	var ry = this.canvas.height / ( maxY + nudgeY );
	var scale = ( rx < ry ) ? rx : ry;
	
	//------------------------------------------------------------
	//	Center the shape into the center of the canvas
	//------------------------------------------------------------
	var centerX = this.canvas.width / 2;
	
	//------------------------------------------------------------
	//	If reset draw very quickly what's already been drawn
	//------------------------------------------------------------
	if ( _reset == true ) {
		var i=1;
		while ( i < this.current ) {
			this.toCanvas( coords, i, scale, centerX, nudgeY );
			i++;
		}
		_reset = false;
		return;
	}
	
	//------------------------------------------------------------
	//  Draw with a delay
	//------------------------------------------------------------
	var i=1
	while ( i < coords.length ) {
		setTimeout( this.timeToCanvas(coords, i, scale, centerX, nudgeY), this.options['delay']*1000*i );
		i++;
	}
}

LSYS.TwoD.prototype.timeToCanvas = function( _coords, _i, _scale, _centerX, _nudgeY ) {
	var self = this;
	return function() {
		self.current = _i;
		self.toCanvas( _coords, _i, _scale, _centerX, _nudgeY );
	}
}
LSYS.TwoD.prototype.toCanvas = function( _coords, _i, _scale, _centerX, _nudgeY ) {
	var self = this;
	self.ctx.beginPath();
	self.ctx.moveTo( (_coords[_i-1][0])*_scale + _centerX, (_coords[_i-1][1]+_nudgeY)*_scale);
	self.ctx.lineTo( (_coords[_i][0])*_scale + _centerX, (coords[_i][1]+_nudgeY)*_scale);
	self.ctx.stroke();
	self.ctx.closePath();
	self.ctx.stroke();
}



//------------------------------------------------------------
//	3D renderer class
//------------------------------------------------------------
LSYS.ThreeD = function( _canvas, _options ){
	LSYS.Renderer.call( this, _canvas );
	//------------------------------------------------------------
	//  Set options
	//------------------------------------------------------------
	this.options = ( _options == undefined ) ? {} : _options;
	this.options['delay'] = ( this.options['delay'] == undefined ) ? 0 : this.options['delay'];
	self.i = 1;
}
LSYS.ThreeD.prototype = Object.create( LSYS.Renderer.prototype );
LSYS.ThreeD.prototype.draw = function( _input, _angle, _renderer) {
	var coords = [];
	var angle = 0;
	var x = 0;
	var y = 0;
	//------------------------------------------------------------
	//	Loop through the LSys input string
	//------------------------------------------------------------
	var chars = _input.split('');
	for ( var i=0; i<chars.length; i++ ) {
		if ( chars[i] in this.constants ) {
			switch ( this.constants[ chars[i] ] ) {
				case 'COUNTERCLOCK':
					angle += _angle;
					break;
				case 'CLOCKWISE':
					angle -= _angle;
					break;
			}
		}
		//------------------------------------------------------------
		//  Let's do some magic happen.
		//------------------------------------------------------------
		else {
			var vector = Math.toCart( 1, Math.toRad( angle ) );
			x += vector[0];
			y += vector[1];
			z = 0;
			if ( this.func != undefined ) {
				z = this.func( x, y );
			}
			coords.push( [x,y,z] );
		}
	}
	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
	var geometry = new THREE.CubeGeometry( 2, 2, 2 );
	//------------------------------------------------------------
	//  Draw all of the coordinates
	//------------------------------------------------------------
	for ( var j=0; j<coords.length; j++ ) {
		for ( var i=0; i<geometry.faces.length; i+=2 ) {
			var hex = Math.random() * 0xffffff;
			geometry.faces[ i ].color.setHex( hex );
			geometry.faces[ i + 1 ].color.setHex( hex );
		}
		var cube = new THREE.Mesh( geometry, material );
		cube.position.y = coords[j][1];
		cube.position.x = coords[j][0];
		cube.position.z = coords[j][2];
		_renderer.scene.add( cube );
	}
}

/**
 * init()
 *
 * _func { function }
 */
LSYS.ThreeD.prototype.init = function( _func ) {
	var self = this;
	this.func = _func;
	//------------------------------------------------------------
	//  Scene
	//------------------------------------------------------------
	this.scene = new THREE.Scene();
	//------------------------------------------------------------
	// Camera
	//------------------------------------------------------------
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 1, 1000 );
	this.camera.position.x = 400;
	this.camera.position.y = 400;
	this.camera.position.z = 200;
	this.camera.lookAt( this.scene.position );
	//------------------------------------------------------------
	//  Renderer
	//------------------------------------------------------------
	this.render = new THREE.WebGLRenderer({ antialias: false, canvas: this.canvas });
	this.render.setSize( window.innerWidth, window.innerHeight );
	this.render.setClearColor( 0xAAAAAA, 1.0 );
	//------------------------------------------------------------
	//  Controls
	//------------------------------------------------------------
    this.controls = new THREE.TrackballControls( this.camera );
	this.controls.rotateSpeed = 1.0;
	this.controls.zoomSpeed = 1.2;
	this.controls.panSpeed = 0.8;
	this.controls.noZoom = false;
	this.controls.noPan = false;
	this.controls.staticMoving = true;
	this.controls.dynamicDampingFactor = 0.3;
	this.controls.keys = [ 65, 83, 68 ];
	this.controls.addEventListener( 'change', 
		function() { 
			self.render.render( self.scene, self.camera );
		}
	);
	//------------------------------------------------------------
	//  Widow resize
	//------------------------------------------------------------
	window.addEventListener( 'resize', function() {
		this.controls.handleResize();
		this.render.setSize( window.innerWidth, window.innerHeight );
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	});
	//------------------------------------------------------------
	//  shim layer with setTimeout fallback
	//------------------------------------------------------------
	window.requestAnimFrame = ( function(){
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
					window.setTimeout( callback, 1000 / 60 );
				};
	})();
	self.animate();
}
LSYS.ThreeD.prototype.animate = function() {
	var self = this;
	requestAnimationFrame( function(){ self.animate() } );
    this.render.render( this.scene, this.camera );
	this.controls.update();
}



//------------------------------------------------------------
//	Library
//------------------------------------------------------------
//------------------------------------------------------------
//  2D
//------------------------------------------------------------
LSYS.DragonCurve = function( _canvas ) {
	LSYS.TwoD.call( this, _canvas, { 'delay': .001 } );
	var sys = new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' );
	sys.run();
	sys.draw( this );
}
LSYS.DragonCurve.prototype = Object.create( LSYS.TwoD.prototype );;

LSYS.HexagonSierpinski = function( _canvas ) {
	LSYS.TwoD.call( this, _canvas, { 'delay': .001, 'colors': ['#FF0000','#0000FF'] } );
	var sys = new LSYS.Sys( 8, 60, 'A', 'A=B-A-B', 'B=A+B+A' );
	sys.run();
	sys.draw( this );
}
LSYS.HexagonSierpinski.prototype = Object.create( LSYS.TwoD.prototype );;

//------------------------------------------------------------
// 3D
//------------------------------------------------------------
//------------------------------------------------------------
//	Library
//------------------------------------------------------------
LSYS.ThreeD_DragonCurve = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _a, _b ) {
		return _a%_b;
	}) ;
	var sys = new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_DragonCurve.prototype = Object.create( LSYS.ThreeD.prototype );;

//------------------------------------------------------------
// 3D
//------------------------------------------------------------
//------------------------------------------------------------
//	Library
//------------------------------------------------------------
LSYS.ThreeD_HexagonSierpinski = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	/*
	this.init( function( _a, _b ) {
		return _a+_b;
	});
	*/
	this.init( function( _a, _b ) {
		return _a%_b;
	}) ;
	var sys = new LSYS.Sys( 8, 60, 'A', 'A=B-A-B', 'B=A+B+A' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_HexagonSierpinski.prototype = Object.create( LSYS.ThreeD.prototype );;


//------------------------------------------------------------
//	Some handy math functions
//------------------------------------------------------------
Math.toRad = function( _degrees ) {
	return _degrees*Math.PI / 180;
}

Math.toCart = function( _radius, _angle ) {
	return [ _radius*Math.cos( _angle ), _radius*Math.sin( _angle ) ];
}