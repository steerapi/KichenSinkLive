(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/camera_ar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "camera_ar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var button = Ti.UI.createButton({
	color:'#fff',
	backgroundImage:'../images/BUTT_grn_on.png',
	backgroundSelectedImage:'../images/BUTT_grn_off.png',
	backgroundDisabledImage: '../images/BUTT_gry_on.png',
	bottom:10,
	width:301,
	height:57,
	font:{fontSize:20,fontWeight:'bold',fontFamily:'Helvetica Neue'},
	title:'Cancel'
});

var messageView = Ti.UI.createView({
	height:60,
	width:250,
	top:10
});

var indView = Ti.UI.createView({
	height:60,
	width:270,
	backgroundColor:'#000',
	borderRadius:10,
	opacity:0.7
});
messageView.add(indView);

// message
var message = Ti.UI.createLabel({
	text:'Calculating...',
	color:'#fff',
	font:{fontSize:14,fontWeight:'bold',fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:270,
	height:'auto'
});
messageView.add(message);

var overlay = Ti.UI.createView();
overlay.add(button);
overlay.add(messageView);

button.addEventListener('click',function()
{
	Ti.Media.hideCamera();
});

var heading;
var gps='...';
var address='calculating address';

function refreshLabel()
{
	var text = "Heading: "+Math.round(heading)+"°, Location: "+gps;
	if (address)
	{
		text+="\n"+address;
	}
	message.text = text;
}

Ti.include("version.js");
if (isIPhone3_2_Plus())
{
	Ti.Geolocation.purpose = "AR Demo";
}

Ti.Geolocation.addEventListener('location',function(e)
{
	var longitude = e.coords.longitude;
	var latitude = e.coords.latitude;
	gps = Math.round(longitude)+' x '+Math.round(latitude);
	Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
	{
		var places = evt.places[0];
		address = places.street ? places.street : places.address;
		refreshLabel();
	});
	refreshLabel();
});

Ti.Geolocation.addEventListener('heading',function(e)
{
	if (e.error)
	{
		updatedHeading.text = 'error: ' + e.error;
		return;
	}

	heading = e.heading.magneticHeading;
	refreshLabel();
});


Ti.Media.showCamera({

	success:function(event)
	{
	},
	cancel:function()
	{
	},
	error:function(error)
	{
		var a = Ti.UI.createAlertDialog({title:'Camera'});
		if (error.code == Ti.Media.NO_CAMERA)
		{
			a.setMessage('Please run this test on device');
		}
		else
		{
			a.setMessage('Unexpected error: ' + error.code);
		}
		a.show();
	},
	overlay:overlay,
	showControls:false,	// don't show system controls
	mediaTypes:Ti.Media.MEDIA_TYPE_PHOTO,
	autohide:false	// tell the system not to auto-hide and we'll do it ourself
});