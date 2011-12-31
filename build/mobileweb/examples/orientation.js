(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/orientation.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "orientation.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

//
// SUPPORTED ORIENTATION MODES
//
//	Ti.UI.PORTRAIT (1)
//	Ti.UI.UPSIDE_PORTRAIT (2)
//	Ti.UI.LANDSCAPE_LEFT (3)
//	Ti.UI.LANDSCAPE_RIGHT (4)
//	Ti.UI.FACE_UP (5)
//	Ti.UI.FACE_DOWN (6)
//	Ti.UI.UNKNOWN (7)
//

// initialize to all modes
win.orientationModes = [
	Ti.UI.PORTRAIT,
	Ti.UI.UPSIDE_PORTRAIT,
	Ti.UI.LANDSCAPE_LEFT,
	Ti.UI.LANDSCAPE_RIGHT,
	Ti.UI.FACE_UP,
	Ti.UI.FACE_DOWN
]; 


//
// helper function
//
function getOrientation(o)
{
	switch (o)
	{
		case Ti.UI.PORTRAIT:
			return 'portrait';
		case Ti.UI.UPSIDE_PORTRAIT:
			return 'reverse portrait';
		case Ti.UI.LANDSCAPE_LEFT:
			return 'landscape';
		case Ti.UI.LANDSCAPE_RIGHT:
			return 'reverse landscape';
		case Ti.UI.FACE_UP:
			return 'face up';
		case Ti.UI.FACE_DOWN:
			return 'face down';
		case Ti.UI.UNKNOWN:
			return 'unknown';
	}
}

//
// get current orientation
//
var l = Ti.UI.createLabel({
	color:'#999',
	text:'Current Orientation: ' + getOrientation(Ti.Gesture.orientation),
	top:10,
	width:300,
	height:'auto',
	textAlign:'center'
});
win.add(l);

//
// orientation change listener
//
Ti.Gesture.addEventListener('orientationchange',function(e)
{
	// device orientation
	l.text = 'Current Orientation: ' + getOrientation(Ti.Gesture.orientation);
	
	// get orienation from event object
	var orientation = getOrientation(e.orientation);
	
	Ti.API.info("orientation changed = "+orientation+", is portrait?"+e.source.isPortrait()+", orientation = "+Ti.Gesture.orientation + "is landscape?"+e.source.isLandscape());
});


//
// set orientation - landscape 
//
var b1 = Ti.UI.createButton({
	title:'Set Landscape ',
	width:200,
	height:40,
	top:40
});
b1.addEventListener('click', function()
{
	Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
});
win.add(b1);

//
// set orientation - landscape portrait
//
var b2 = Ti.UI.createButton({
	title:'Set Portrait',
	width:200,
	height:40,
	top:90
});
b2.addEventListener('click', function()
{
	win.orientationModes = [Ti.UI.PORTRAIT];
});
win.add(b2);

var b3 = Ti.UI.createButton({
	title:'Reset orientation',
	width:200,
	height:40,
	top:140
});
b3.addEventListener('click', function()
{
	Ti.API.info("resetting orientation modes");
	win.orientationModes = [];
});
win.add(b3);

if (Ti.Platform.name == 'iPhone OS')
{
	var landscape = Ti.UI.createButton({
		title:'Allow Landscape Only',
		width:200,
		height:40,
		top:190
	});
	landscape.addEventListener('click', function()
	{
		// set and enforce landscape for this window
		win.orientationModes = [
			Ti.UI.LANDSCAPE_LEFT,
			Ti.UI.LANDSCAPE_RIGHT
		]; 
		Ti.UI.orientation = Ti.UI.LANDSCAPE_LEFT;
	});
	win.add(landscape);
}

//
// open a new window
//
var b4 = Ti.UI.createButton({
	title:'Open A Window',
	width:200,
	height:40,
	top:240
});
b4.addEventListener('click', function()
{
	var subwin = Ti.UI.createWindow({
		url:'vibrate.js',
		backgroundColor:'purple'
	});

	subwin.orientationModes = [ 
		Ti.UI.PORTRAIT, 
		Ti.UI.UPSIDE_PORTRAIT, 
		Ti.UI.LANDSCAPE_LEFT, 
		Ti.UI.LANDSCAPE_RIGHT, 
		Ti.UI.FACE_UP, 
		Ti.UI.FACE_DOWN
	];

	var close = Ti.UI.createButton({
		title:'close',
		width:200,
		height:40,
		top:60
	});
	subwin.add(close);
	close.addEventListener('click', function()
	{
		if (Ti.Platform.osname == 'android')
		{
			// reset the orientation modes on the parent to ensure the orientation gets reset on the previous window
			win.orientationModes = win.orientationModes;
		}
		subwin.close();
	});
	subwin.open();
});
win.add(b4);



;