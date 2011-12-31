(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/geolocation.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "geolocation.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundColor = '#fff';

Ti.include("version.js");

Ti.Geolocation.preferredProvider = "gps";

if (isIPhone3_2_Plus())
{
	//NOTE: starting in 3.2+, you'll need to set the applications
	//purpose property for using Location services on iPhone
	Ti.Geolocation.purpose = "GPS demo";
}

function translateErrorCode(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
}

var currentHeadingLabel = Ti.UI.createLabel({
	text:'Current Heading (One Shot)',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#111',
	top:10,
	left:10,
	height:15,
	width:300
});
win.add(currentHeadingLabel);

var currentHeading = Ti.UI.createLabel({
	text:'Updated Heading not fired',
	font:{fontSize:12},
	color:'#444',
	top:30,
	left:10,
	height:15,
	width:300
});
win.add(currentHeading);

var updatedHeadingLabel = Ti.UI.createLabel({
	text:'Updated Heading',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#111',
	top:50,
	left:10,
	height:15,
	width:300
});
win.add(updatedHeadingLabel);

var updatedHeading = Ti.UI.createLabel({
	text:'Updated Heading not fired',
	font:{fontSize:12},
	color:'#444',
	top:70,
	left:10,
	height:15,
	width:300
});
win.add(updatedHeading);

var updatedHeadingTime = Ti.UI.createLabel({
	text:'',
	font:{fontSize:11},
	color:'#444',
	top:90,
	left:10,
	height:15,
	width:300
});
win.add(updatedHeadingTime);

var currentLocationLabel = Ti.UI.createLabel({
	text:'Current Location (One Shot)',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#111',
	top:110,
	left:10,
	height:15,
	width:300
});
win.add(currentLocationLabel);

var currentLocation = Ti.UI.createLabel({
	text:'Current Location not fired',
	font:{fontSize:11},
	color:'#444',
	top:130,
	left:10,
	height:15,
	width:300
});
win.add(currentLocation);

var updatedLocationLabel = Ti.UI.createLabel({
	text:'Updated Location',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#111',
	top:150,
	left:10,
	height:15,
	width:300
});
win.add(updatedLocationLabel);

var updatedLocation = Ti.UI.createLabel({
	text:'Updated Location not fired',
	font:{fontSize:11},
	color:'#444',
	top:170,
	left:10,
	height:15,
	width:300
});
win.add(updatedLocation);

var updatedLatitude = Ti.UI.createLabel({
	text:'',
	font:{fontSize:11},
	color:'#444',
	top:190,
	left:10,
	height:15,
	width:300
});
win.add(updatedLatitude);

var updatedLocationAccuracy = Ti.UI.createLabel({
	text:'',
	font:{fontSize:11},
	color:'#444',
	top:210,
	left:10,
	height:15,
	width:300
});
win.add(updatedLocationAccuracy);

var updatedLocationTime = Ti.UI.createLabel({
	text:'',
	font:{fontSize:11},
	color:'#444',
	top:230,
	left:10,
	height:15,
	width:300
});
win.add(updatedLocationTime);



var forwardGeoLabel = Ti.UI.createLabel({
	text:'Forward Geo (Addr->Coords)',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#111',
	top:250,
	left:10,
	height:15,
	width:300
});
win.add(forwardGeoLabel);

var forwardGeo = Ti.UI.createLabel({
	text:'',
	font:{fontSize:11},
	color:'#444',
	top:270,
	left:10,
	height:15,
	width:300
});
win.add(forwardGeo);

var reverseGeoLabel = Ti.UI.createLabel({
	text:'Reverse Geo (Coords->Addr)',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#111',
	top:290,
	left:10,
	height:15,
	width:300
});
win.add(reverseGeoLabel);

var reverseGeo = Ti.UI.createLabel({
	text:'',
	font:{fontSize:11},
	color:'#444',
	top:310,
	left:10,
	height:15,
	width:300
});
win.add(reverseGeo);

// state vars used by resume/pause
var headingAdded = false;
var locationAdded = false;

//
//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
//
if (Ti.Geolocation.locationServicesEnabled === false)
{
	Ti.UI.createAlertDialog({title:'Kitchen Sink', message:'Your device has geo turned off - turn it on.'}).show();
}
else
{
	if (Ti.Platform.name != 'android') {
		var authorization = Ti.Geolocation.locationServicesAuthorization;
		Ti.API.info('Authorization: '+authorization);
		if (authorization == Ti.Geolocation.AUTHORIZATION_DENIED) {
			Ti.UI.createAlertDialog({
				title:'Kitchen Sink',
				message:'You have disallowed Titanium from running geolocation services.'
			}).show();
		}
		else if (authorization == Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			Ti.UI.createAlertDialog({
				title:'Kitchen Sink',
				message:'Your system has disallowed Titanium from running geolocation services.'
			}).show();
		}
	}

	//
	// IF WE HAVE COMPASS GET THE HEADING
	//
	if (Ti.Geolocation.hasCompass)
	{
		//
		//  TURN OFF ANNOYING COMPASS INTERFERENCE MESSAGE
		//
		Ti.Geolocation.showCalibration = false;

		//
		// SET THE HEADING FILTER (THIS IS IN DEGREES OF ANGLE CHANGE)
		// EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
		Ti.Geolocation.headingFilter = 90;

		//
		//  GET CURRENT HEADING - THIS FIRES ONCE
		//
		Ti.Geolocation.getCurrentHeading(function(e)
		{
			if (e.error)
			{
				currentHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
				return;
			}
			var x = e.heading.x;
			var y = e.heading.y;
			var z = e.heading.z;
			var magneticHeading = e.heading.magneticHeading;
			var accuracy = e.heading.accuracy;
			var trueHeading = e.heading.trueHeading;
			var timestamp = e.heading.timestamp;

			currentHeading.text = 'x:' + x + ' y: ' + y + ' z:' + z;
			Ti.API.info('geo - current heading: ' + new Date(timestamp) + ' x ' + x + ' y ' + y + ' z ' + z);
		});

		//
		// EVENT LISTENER FOR COMPASS EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON HEADING FILTER)
		//
		var headingCallback = function(e)
		{
			if (e.error)
			{
				updatedHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
				return;
			}

			var x = e.heading.x;
			var y = e.heading.y;
			var z = e.heading.z;
			var magneticHeading = e.heading.magneticHeading;
			var accuracy = e.heading.accuracy;
			var trueHeading = e.heading.trueHeading;
			var timestamp = e.heading.timestamp;

			updatedHeading.text = 'x:' + x + ' y: ' + y + ' z:' + z;
			updatedHeadingTime.text = 'timestamp:' + new Date(timestamp);
			updatedHeading.color = 'red';
			updatedHeadingTime.color = 'red';
			setTimeout(function()
			{
				updatedHeading.color = '#444';
				updatedHeadingTime.color = '#444';

			},100);

			Ti.API.info('geo - heading updated: ' + new Date(timestamp) + ' x ' + x + ' y ' + y + ' z ' + z);
		};
		Ti.Geolocation.addEventListener('heading', headingCallback);
		headingAdded = true;
	}
	else
	{
		Ti.API.info("No Compass on device");
		currentHeading.text = 'No compass available';
		updatedHeading.text = 'No compass available';
	}

	//
	//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
	//
	// Ti.Geolocation.ACCURACY_BEST
	// Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS
	// Ti.Geolocation.ACCURACY_HUNDRED_METERS
	// Ti.Geolocation.ACCURACY_KILOMETER
	// Ti.Geolocation.ACCURACY_THREE_KILOMETERS
	//
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;

	//
	//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
	//  THIS VALUE IS IN METERS
	//
	Ti.Geolocation.distanceFilter = 10;

	//
	// GET CURRENT POSITION - THIS FIRES ONCE
	//
	Ti.Geolocation.getCurrentPosition(function(e)
	{
		if (!e.success || e.error)
		{
			currentLocation.text = 'error: ' + JSON.stringify(e.error);
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			alert('error ' + JSON.stringify(e.error));
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;
		Ti.API.info('speed ' + speed);
		currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;

		Ti.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	});

	//
	// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
	//
	var locationCallback = function(e)
	{
		if (!e.success || e.error)
		{
			updatedLocation.text = 'error:' + JSON.stringify(e.error);
			updatedLatitude.text = '';
			updatedLocationAccuracy.text = '';
			updatedLocationTime.text = '';
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;

		//Ti.Geolocation.distanceFilter = 100; //changed after first location event

		updatedLocation.text = 'long:' + longitude;
		updatedLatitude.text = 'lat: '+ latitude;
		updatedLocationAccuracy.text = 'accuracy:' + accuracy;
		updatedLocationTime.text = 'timestamp:' +new Date(timestamp);

		updatedLatitude.color = 'red';
		updatedLocation.color = 'red';
		updatedLocationAccuracy.color = 'red';
		updatedLocationTime.color = 'red';
		setTimeout(function()
		{
			updatedLatitude.color = '#444';
			updatedLocation.color = '#444';
			updatedLocationAccuracy.color = '#444';
			updatedLocationTime.color = '#444';

		},100);

		// reverse geo
		Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
		{
			if (evt.success) {
				var places = evt.places;
				if (places && places.length) {
					reverseGeo.text = places[0].address;
				} else {
					reverseGeo.text = "No address found";
				}
				Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
			}
			else {
				Ti.UI.createAlertDialog({
					title:'Reverse geo error',
					message:evt.error
				}).show();
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
			}
		});


		Ti.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};
	Ti.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;
}
var addr = "2065 Hamilton Avenue San Jose California 95125";

Ti.Geolocation.forwardGeocoder(addr,function(evt)
{
	Ti.API.info('in forward ');
	forwardGeo.text = "lat:"+evt.latitude+", long:"+evt.longitude;
	Ti.Geolocation.reverseGeocoder(evt.latitude,evt.longitude,function(evt)
	{
		if (evt.success) {
			var text = "";
			for (var i = 0; i < evt.places.length; i++) {
				text += "" + i + ") " + evt.places[i].address + "\n";
			}
			Ti.API.info('Reversed forward: '+text);
		}
		else {
			Ti.UI.createAlertDialog({
				title:'Forward geo error',
				message:evt.error
			}).show();
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
		}
	});
});

if (Ti.Platform.name == 'android')
{
	//  as the destroy handler will remove the listener, only set the pause handler to remove if you need battery savings
	Ti.Android.currentActivity.addEventListener('pause', function(e) {
		Ti.API.info("pause event received");
		if (headingAdded) {
			Ti.API.info("removing heading callback on pause");
			Ti.Geolocation.removeEventListener('heading', headingCallback);
			headingAdded = false;
		}
		if (locationAdded) {
			Ti.API.info("removing location callback on pause");
			Ti.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	Ti.Android.currentActivity.addEventListener('destroy', function(e) {
		Ti.API.info("destroy event received");
		if (headingAdded) {
			Ti.API.info("removing heading callback on destroy");
			Ti.Geolocation.removeEventListener('heading', headingCallback);
			headingAdded = false;
		}
		if (locationAdded) {
			Ti.API.info("removing location callback on destroy");
			Ti.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	Ti.Android.currentActivity.addEventListener('resume', function(e) {
		Ti.API.info("resume event received");
		if (!headingAdded) {
			Ti.API.info("adding heading callback on resume");
			Ti.Geolocation.addEventListener('heading', headingCallback);
			headingAdded = true;
		}
		if (!locationAdded) {
			Ti.API.info("adding location callback on resume");
			Ti.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}
	});
}

;