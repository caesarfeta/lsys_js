/**
 * @author AdamTavares / http://adamtavares.com
*/
var LSYS = LSYS || { REVISION: '1' }


/**
 * Build a full screen canvas
*/
AutoCanvas = function( _id, _padding ) {
	this.padding = ( _padding != undefined ) ? _padding : 0;
	this.canvas = document.createElement("canvas");
	document.body.appendChild( this.canvas );
	this.canvas.id = _id;
	this.resize();
	var self = this;
	window.addEventListener('resize', function( _event ) {
	  	self.resize();
	});}
AutoCanvas.prototype.resize = function() {
	this.canvas.width = document.body.clientWidth - this.padding;
	this.canvas.height = document.body.clientHeight - this.padding;
	this.canvas.style.position = "fixed";
	this.canvas.style.top = this.padding/2;
	this.canvas.style.left = this.padding/2;
}

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
	//------------------------------------------------------------
	//	TODO: check to see if renderer is valid...
	//------------------------------------------------------------
	_renderer.draw( this.output, this.angle );
	var self = this;
	window.addEventListener( 'resize', function( _event ) {
	  	_renderer.draw( self.output, self.angle );
	});
}
LSYS.Sys.prototype.run = function() {
	while( this.n < this.iter ) {
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



LSYS.Renderer = function( _canvasId ) {
	this.canvas = document.getElementById( _canvasId );
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
LSYS.TwoD = function( _canvasId ){
	LSYS.Renderer.call( this, _canvasId );
	this.ctx = this.canvas.getContext('2d');
}
LSYS.TwoD.prototype = Object.create( LSYS.Renderer.prototype );
LSYS.TwoD.prototype.draw = function( _input, _angle ) {
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
	//  Get the values you need to nudge the shape in place
	//------------------------------------------------------------
	var nudgeX = ( minX < 0 ) ? minX*-1 : 0;
	var nudgeY = ( minY < 0 ) ? minY*-1 : 0;	
	
	//------------------------------------------------------------
	//  Scale the thing up to the size of the canvas
	//------------------------------------------------------------
	var rx = this.canvas.width / ( maxX + nudgeX );
	var ry = this.canvas.height / ( maxY + nudgeY );
	var scale = ( rx < ry ) ? rx : ry;
	
	//------------------------------------------------------------
	//  Center the shape into the center of the canvas
	//------------------------------------------------------------
	var centerX = this.canvas.width / 2;
	
	//------------------------------------------------------------
	//	Draw the thing to the canvas
	//------------------------------------------------------------
	var i = 1;
	while ( i < coords.length ) {
		this.ctx.beginPath();
		this.ctx.moveTo( (coords[i-1][0])*scale + centerX, (coords[i-1][1]+nudgeY)*scale);
		this.ctx.lineTo( (coords[i][0])*scale + centerX, (coords[i][1]+nudgeY)*scale);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.stroke();
		i++;
	}
}



//------------------------------------------------------------
//	3D renderer class
//------------------------------------------------------------
LSYS.ThreeD = function(){
	return {
		draw: function( _input, _angle ) {}
	}
}
LSYS.ThreeD.prototype = Object.create( LSYS.Renderer.prototype );
LSYS.ThreeD.draw = function() {
	
}



//------------------------------------------------------------
//  Library
//------------------------------------------------------------
LSYS.DragonCurve = function( _canvasId ) {
	var sys = new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' );
	sys.run();
	var renderer = new LSYS.TwoD( _canvasId );
	sys.draw( renderer );
}

LSYS.HexagonSierpinski = function( _canvasId ) {
	var sys = new LSYS.Sys( 8, 60, 'A', 'A=B-A-B', 'B=A+B+A' );
	sys.run();
	var renderer = new LSYS.TwoD( _canvasId );
	sys.draw( renderer );
}



//------------------------------------------------------------
//	Some handy math functions
//------------------------------------------------------------
Math.toRad = function( _degrees ) {
	return _degrees*Math.PI / 180;
}

Math.toCart = function( _radius, _angle ) {
	return [ _radius*Math.cos( _angle ), _radius*Math.sin( _angle ) ];
}



//------------------------------------------------------------
// Stuff to investigate.
//------------------------------------------------------------
// semi-Thue grammar
// Chomsky hierarchy
// L-systems are now commonly known as parametric L systems.
// G = ( V, w, P )

/*
	  process: function process(cmds, draw)
	  {
		 this._stack = [];
		 
		 var angle = this._angle;
		 var distance = this._distance;
		 var lastX;
		 var lastY;
		 
		 if (draw)
		 {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');
			
			// clear the background 
			ctx.save();
			ctx.fillStyle = "rgb(255,255,255)";
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			
			// offset as required
			ctx.translate(this._xOffset, 0);
			
			// initial colour if specific colouring not used
			ctx.strokeStyle = "rgb(0,0,0)";
		 }
		 
		 // start at grid 0,0 facing north with no colour index
		 var pos = new LSystems.Location(0.0, 0.0, 90.0, -1);
		 
		 // process each command in turn
		 var yOffset = this._yOffset, maxStackDepth = this._maxStackDepth;
		 var colourList = this._colourList, stack = this._stack;
		 var renderLineWidths = this._renderLineWidths;
		 var rad, width, colour, lastColour = null;
		 var c, len = cmds.length;
		 for (var i=0; i<len; i++)
		 {
			c = cmds.charAt(i);
			
			switch (c)
			{
			   case COLOUR:
			   {
				  // get colour index from next character
				  pos.colour = (cmds.charAt(++i) - '0');
				  break;
			   }
			   
			   case ANTICLOCK:
			   {
				  pos.heading += angle;
				  break;
			   }
			   
			   case CLOCKWISE:
			   {
				  pos.heading -= angle;
				  break;
			   }
			   
			   case PUSH:
			   {
				  stack.push(new LSystems.Location(pos.x, pos.y, pos.heading, pos.colour));
				  break;
			   }
			   
			   case POP:
			   {
				  pos = stack.pop();
				  break;
			   }
			   
			   default:
			   {
				  if (!this._constants[c])
				  {
					 lastX = pos.x;
					 lastY = pos.y;
					 
					 // move the turtle
					 rad = pos.heading * RAD;
					 pos.x += distance * Math.cos(rad);
					 pos.y += distance * Math.sin(rad);
					 
					 if (draw)
					 {
						// render this element
						if (renderLineWidths)
						{
						   width = (maxStackDepth - stack.length);
						   ctx.lineWidth = width >= 1 ? width : 1;
						}
						colour = colourList[pos.colour];
						if (colour && lastColour !== colour)
						{
						   ctx.strokeStyle = colour;
						   lastColour = colour;
						}
						ctx.beginPath();
						ctx.moveTo(lastX, HEIGHT - (lastY + yOffset));
						ctx.lineTo(pos.x, HEIGHT - (pos.y + yOffset));
						ctx.closePath();
						ctx.stroke();
					 }
					 else
					 {
						// remember min/max position
						if (pos.x < this._minx) this._minx = pos.x;
						else if (pos.x > this._maxx) this._maxx = pos.x;
						if (pos.y < this._miny) this._miny = pos.y;
						else if (pos.y > this._maxy) this._maxy = pos.y;
						if (stack.length > this._maxStackDepth) this._maxStackDepth = stack.length;
					 }
				  }
				  break;
			   }
			}
		 }
		 
		 // finalise rendering
		 if (draw)
		 {
			ctx.restore();
		 }
	  }
   };
   */