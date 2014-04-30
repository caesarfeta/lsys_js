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
	/*
	this.init( function( _a, _b ) {
		return _a+_b;
	});
	this.init( function( _a, _b, ) {
		return _a%_b;
	});
	this.init( function( _a, _b, _i ) {
		return _i/50;
	});
	*/
	this.init( function( _a, _b, _i ) {
		return _i*_b/5000;
	});
	var sys = new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_DragonCurve.prototype = Object.create( LSYS.ThreeD.prototype );;

LSYS.ThreeD_HexagonSierpinski = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	/*
	this.init( function( _a, _b ) {
		return _a+_b;
	});
	this.init( function( _a, _b, ) {
		return _a%_b;
	});
	this.init( function( _a, _b, _i ) {
		return _i/50;
	});
	*/
	this.init( function( _a, _b, _i ) {
		return _i*_b/2000;
	});
	var sys = new LSYS.Sys( 8, 60, 'A', 'A=B-A-B', 'B=A+B+A' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_HexagonSierpinski.prototype = Object.create( LSYS.ThreeD.prototype );;

/* COPY ME--- 
LSYS.ThreeD_U = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return 10*Math.sin( (_i%_total) * Math.toRad( 15 ) );
	});
	var sys = new LSYS.Sys( 8, 60, 'A', 'A=B+A+B', 'B=A-BB' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_U.prototype = Object.create( LSYS.ThreeD.prototype );
*/

LSYS.ThreeD_Shrimp = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return 10*Math.sin( (_i%_total) * Math.toRad( 15 ) );
		//return 1;
	});
	var sys = new LSYS.Sys( 8, 60, 'A', 'A=B+A+B', 'B=A-BB' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_Shrimp.prototype = Object.create( LSYS.ThreeD.prototype );

LSYS.ThreeD_StretchCoil = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return _i*_y/200;
	});
	var sys = new LSYS.Sys( 6, 4, 'ABA', 'A=BB', 'B=A-BB' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_StretchCoil.prototype = Object.create( LSYS.ThreeD.prototype );

LSYS.ThreeD_StretchCoil = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return _i*_y/200;
	});
	var sys = new LSYS.Sys( 6, 4, 'ABA', 'A=BB', 'B=A-BB' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_StretchCoil.prototype = Object.create( LSYS.ThreeD.prototype );
 
LSYS.ThreeD_Squiggle = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return _i*_x/20000;
	});
	var sys = new LSYS.Sys( 8, 90, 'A', 'A=B+A-B', 'B=A-B-BB' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_Squiggle.prototype = Object.create( LSYS.ThreeD.prototype );

LSYS.ThreeD_Chip = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return _i/100;
	});
	var sys = new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_Chip.prototype = Object.create( LSYS.ThreeD.prototype );

LSYS.ThreeD_ChipTear = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return _y+900/_x;
	});
	var sys = new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_ChipTear.prototype = Object.create( LSYS.ThreeD.prototype );

LSYS.ThreeD_U = function( _canvas ) {
	LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
	this.init( function( _x, _y, _i, _total ) {
		return _i/_total;
	});
	var sys = new LSYS.Sys( 4, 270, 'A', 'A=--AA' );
	sys.run();
	sys.draw( this );
}
LSYS.ThreeD_U.prototype = Object.create( LSYS.ThreeD.prototype );
