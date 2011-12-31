(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/platform.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "platform.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// for battery level to work, you have to turn it
// on first otherwise it will report -1.  if you
// add a battery listener, it will turn it on for you
// automagically
var needUpdate = false;
Ti.Platform.batteryMonitoring = true;

win.addEventListener('close',function()
{
	// turn it off, no need to waste the battery
	Ti.Platform.batteryMonitoring = false;
	Ti.Platform.removeEventListener('battery');
});

function batteryStateToString(state)
{
	switch (state)
	{
		case Ti.Platform.BATTERY_STATE_UNKNOWN:
			return 'unknown';
		case Ti.Platform.BATTERY_STATE_UNPLUGGED:
			return 'unplugged';
		case Ti.Platform.BATTERY_STATE_CHARGING:
			return 'charging';
		case Ti.Platform.BATTERY_STATE_FULL:
			return 'full';
	}
	return '???';
}

var l1 = Ti.UI.createLabel({
	text:'name/osname:' + Ti.Platform.name+'/'+Ti.Platform.osname,
	top:10,
	left:10,
	width:'auto',
	font:{fontSize:14},
	color:'#777',
	height:'auto'
});

win.add(l1);

var l2 = Ti.UI.createLabel({
	text:'model:' + Ti.Platform.model,
	top:30,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l2);

var l3 = Ti.UI.createLabel({
	text:'version:' + Ti.Platform.version,
	top:50,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l3);

var l4 = Ti.UI.createLabel({
	text:'architecture:' + Ti.Platform.architecture,
	top:70,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l4);

var l5 = Ti.UI.createLabel({
	text:'macaddress:' + Ti.Platform.macaddress,
	top:90,
	left:10,
	width:'auto',
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l5);

var l6 = Ti.UI.createLabel({
	text:'processor count:' + Ti.Platform.processorCount,
	top:110,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l6);


var l7 = Ti.UI.createLabel({
	text:'username:' + Ti.Platform.username,
	top:130,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l7);

// NOTE: Needs to be tested on a physical device to get an accurate value;
// may select the wrong interface on non-mobile devices.
var l8 = Ti.UI.createLabel({
	text:'address:' + Ti.Platform.address,
	top:150,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l8);

var l9 = Ti.UI.createLabel({
	text:'ostype:' + Ti.Platform.ostype,
	top:170,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l9);

if (Ti.Platform.batteryState == Ti.Platform.BATTERY_STATE_UNKNOWN) {
	needUpdate = true;
}

var l11 = Ti.UI.createLabel({
	text:'battery state:' + batteryStateToString(Ti.Platform.batteryState),
	top:190,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l11);

var l12 = Ti.UI.createLabel({
	text:'battery level:' + Ti.Platform.batteryLevel,
	top:210,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l12);

var l13 = Ti.UI.createLabel({
	text:'display width-x-height:' + Ti.Platform.displayCaps.platformWidth + 'x' + Ti.Platform.displayCaps.platformHeight,
	top:230,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l13);

var l15 = Ti.UI.createLabel({
	text:'display density:' + Ti.Platform.displayCaps.density,
	top:250,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l15);

var l16 = Ti.UI.createLabel({
	text:'display dpi:' + Ti.Platform.displayCaps.dpi,
	top:270,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l16);

var l17 = Ti.UI.createLabel({
	text:'available memory:' + Ti.Platform.availableMemory,
	top:290,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l17);

var l18 = Ti.UI.createLabel({
	text:'is24HourTimeFormat:' + Ti.Platform.is24HourTimeFormat(),
	top:310,
	left:10,
	width:300,
	height:'auto',
	font:{fontSize:14},
	color:'#777'
});

win.add(l18);

var b = Ti.UI.createButton({
	title:'Open URL',
	height:30,
	width:200,
	top:330
});
win.add(b);
var openURL=1;
b.addEventListener('click', function()
{
	var url;
	switch(openURL % 3)
	{
		case 0:
			url = 'http://www.google.com';
			b.title='Open URL (web)';
			break;
		case 1:
			url = 'tel:4043332222';
			b.title='Open URL (tel)';
			break;
		case 2:
			url = 'sms:4043332222';
			b.title='Open URL (sms)';
			break;
	}
	if (Ti.Platform.name != 'android') {
		if (!Ti.Platform.canOpenURL(url)) {
			Ti.API.warn("Can't open url: "+url);
		}
	}
	Ti.Platform.openURL(url);
	openURL++;
});

//
// BATTERY STATE CHANGE EVENT
//
Ti.Platform.addEventListener('battery', function(e)
{
	if (needUpdate) {
		l11.text = 'battery state:' + batteryStateToString(e.state);
		l12.text = 'battery level:' + e.level;
	} else {
		//TODO: based on various reports from the google, you only get battery state changes
		//at 5% intervals.... to test this, you gotta unplug and leave your phone sitting for awhile
		var message = 'Battery Notification\n\nLevel: ' + e.level + ', State: '+batteryStateToString(e.state);
		Ti.UI.createAlertDialog({title:'Platform', message:message}).show();
	}
});

Ti.API.info("Current Phone Locale is "+Ti.Platform.locale);
Ti.API.info("OS name is " + Ti.Platform.osname);
Ti.API.info("Runtime: " + Ti.Platform.runtime);

if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
	Ti.API.info("Data network: " + Ti.Platform.dataAddress);
	Ti.API.info("Netmask: " + Ti.Platform.netmask);
}
;