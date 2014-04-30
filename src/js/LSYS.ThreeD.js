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
			coords.push( [x,y] );
		}
	}
	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
	var geometry = new THREE.CubeGeometry( this.cube_size, this.cube_size, this.cube_size );
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
		cube.position.z = ( this.func != undefined ) ? this.func( coords[j][0], coords[j][1], j, coords.length ) : 0;
		_renderer.scene.add( cube );
	}
}

/**
 * init()
 *
 * _func { function }
 */
LSYS.ThreeD.prototype.init = function( _func, _cube_size ) {
	var self = this;
	//------------------------------------------------------------
	//  Stash arguments for use later in draw()
	//------------------------------------------------------------
	this.func = _func;
	this.cube_size = ( _cube_size == undefined ) ? 1 : _cube_size;
	//------------------------------------------------------------
	//  Scene
	//------------------------------------------------------------
	this.scene = new THREE.Scene();
	//------------------------------------------------------------
	// Camera
	//------------------------------------------------------------
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight*.5, 1, 1000 );
//	this.camera = new THREE.OrthographicCamera( window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 1000 );
	this.camera.position.x = 400;
	this.camera.position.y = 400;
	this.camera.position.z = 100;
	this.camera.lookAt( this.scene.position );
	//------------------------------------------------------------
	//  Renderer
	//------------------------------------------------------------
	this.render = new THREE.WebGLRenderer({ antialias: false, canvas: this.canvas });
	this.render.setSize( this.canvas.width, this.canvas.height );
	this.render.setClearColor( 0x222222, 1.0 );
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
