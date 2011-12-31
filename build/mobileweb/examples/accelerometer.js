(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/accelerometer.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "accelerometer.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
var accelerometerAdded = false;

var x = Ti.UI.createLabel({
	text:'x:',
	top:10,
	left:10,
	font:{fontSize:14},
	color:'#555',
	width:300,
	height:'auto'
});
win.add(x);

var y = Ti.UI.createLabel({
	text:'y:',
	top:30,
	left:10,
	font:{fontSize:14},
	color:'#555',
	width:300,
	height:'auto'
});
win.add(y);

var z = Ti.UI.createLabel({
	text:'z:',
	top:50,
	left:10,
	font:{fontSize:14},
	color:'#555',
	width:300,
	height:'auto'
});
win.add(z);

var ts = Ti.UI.createLabel({
	text:'timestamp:',
	top:70,
	left:10,
	font:{fontSize:14},
	color:'#555',
	width:300,
	height:'auto'
});
win.add(ts);

var accelerometerCallback = function(e) {
	ts.text = e.timestamp;
	x.text = 'x: ' + e.x;
	y.text = 'y:' + e.y;
	z.text = 'z:' + e.z;
};

Ti.Accelerometer.addEventListener('update', accelerometerCallback);
accelerometerAdded = true;

if (Ti.Platform.name == 'iPhone OS' && Ti.Platform.model == 'Simulator')
{
	var notice = Ti.UI.createLabel({
		bottom:50,
		font:{fontSize:18},
		color:'#900',
		width:'auto',
		text:'Note: Accelerometer does not work in simulator',
		textAlign:'center'
	});
	win.add(notice);
}

if (Ti.Platform.name == 'android')
{
	Ti.Android.currentActivity.addEventListener('pause', function(e) {
		if (accelerometerAdded) {
			Ti.API.info("removing accelerometer callback on pause");
			Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
		}
	});
	Ti.Android.currentActivity.addEventListener('resume', function(e) {
		if (accelerometerAdded) {
			Ti.API.info("adding accelerometer callback on resume");
			Ti.Accelerometer.addEventListener('update', accelerometerCallback);
		}
	});
}
;