(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/foursquare.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "foursquare.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var android = Ti.Platform.name == 'android';

var username = Ti.UI.createTextField({
	autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	width:300,
	top:10,
	height: android ? 45 : 35,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	hintText:'Foursquare Username'
});
win.add(username);

var password = Ti.UI.createTextField({
	autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	width:300,
	top:android ? 65 : 55,
	height:android ? 45 : 35,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	passwordMask:true,
	hintText:'Foursquare Password'
});
win.add(password);

var button = Ti.UI.createButton({
	title:'Get Venues Nearby',
	top: android ? 120 : 100,
	width:300,
	height: android ? 45 : 40
});
win.add(button);

var statusLabel = Ti.UI.createLabel({
	font:{fontSize:18},
	color:'white',
	width:250,
	height:'auto',
	top:20,
	text:'',
	textAlign:'center'
});

var navActInd = Ti.UI.createActivityIndicator();
if (Ti.Platform.name == 'iPhone OS') {
	win.setRightNavButton(navActInd);
	if (parseFloat(Ti.Platform.version) >= 3.2) {
		Ti.Geolocation.purpose = 'Foursquare';
	}
}

var label = Ti.UI.createLabel({
	text:'Please login',
	font:{fontSize:18},
	color:'white',
	width:250,
	height:'auto',
	textAlign:'center'
});

var scrollView = Ti.UI.createScrollView({
	top: android ? 180 : 150,
	contentHeight:'auto',
	contentWidth:'auto',
	backgroundColor:'#13386c',
	width:300,
	height:200,
	borderRadius:10
});
win.add(scrollView);

scrollView.add(label);


button.addEventListener('click', function()
{
	label.text = "Determining your location...";
	navActInd.show();
	password.blur();
	Ti.API.info("starting geo");
	Ti.Geolocation.getCurrentPosition(function(e)
	{
		Ti.API.info("received geo response");
		if (e.error)
		{
			alert(e.error);
			label.text = e.error.message;
			navActInd.hide();
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;

		label.text = "You are at: "+longitude+"\n"+latitude+"\n\nFinding venues...";

		var xhr = Ti.Network.createHTTPClient();
		xhr.onerror = function(e)
		{
			Ti.API.info("ERROR " + e.error);
			navActInd.hide();
			alert(e.error);
		};
		xhr.onload = function()
		{
			label.hide();

			var resp =  eval('('+this.responseText+')');
			var venues = resp.groups[0].venues;
			for (var i=0;i<venues.length;i++)
			{
				statusLabel.text += venues[i].name+'\n\n';

			}
			scrollView.add(statusLabel);

			navActInd.hide();
		};
		// open the client and encode our URL
		xhr.open('GET','http://api.foursquare.com/v1/venues.json?geolat='+latitude+'&geolong='+longitude);
		// base64 encode our Authorization header
		xhr.setRequestHeader('Authorization','Basic '+Ti.Utils.base64encode(username.value+':'+password.value));

		// send the data
		xhr.send();
		Ti.API.info("sending foursquare API request for "+latitude+","+longitude);
	});
});



;