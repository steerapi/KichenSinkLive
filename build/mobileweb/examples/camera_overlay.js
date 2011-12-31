(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/camera_overlay.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "camera_overlay.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var scanner = Ti.UI.createView({
	width:260,
	height:200,
	borderColor:'red',
	borderWidth:5,
	borderRadius:15
});

var button = Ti.UI.createButton({
	color:'#fff',
	backgroundImage:'../images/BUTT_grn_on.png',
	backgroundSelectedImage:'../images/BUTT_grn_off.png',
	backgroundDisabledImage: '../images/BUTT_gry_on.png',
	bottom:10,
	width:301,
	height:57,
	font:{fontSize:20,fontWeight:'bold',fontFamily:'Helvetica Neue'},
	title:'Take Picture'
});

var messageView = Ti.UI.createView({
	height:30,
	width:250,
	visible:false
});

var indView = Ti.UI.createView({
	height:30,
	width:250,
	backgroundColor:'#000',
	borderRadius:10,
	opacity:0.7
});
messageView.add(indView);

// message
var message = Ti.UI.createLabel({
	text:'Picture Taken',
	color:'#fff',
	font:{fontSize:20,fontWeight:'bold',fontFamily:'Helvetica Neue'},
	width:'auto',
	height:'auto'
});
messageView.add(message);

var overlay = Ti.UI.createView();
overlay.add(scanner);
overlay.add(button);
overlay.add(messageView);

button.addEventListener('click',function()
{
	scanner.borderColor = 'blue';
	Ti.Media.takePicture();
	messageView.animate({visible:true});
	setTimeout(function()
	{
		scanner.borderColor = 'red';
		messageView.animate({visible:false});
	},500);
});


Ti.Media.showCamera({

	success:function(event)
	{
		Ti.API.debug("picture was taken");
		
		// place our picture into our window
		var imageView = Ti.UI.createImageView({
			image:event.media,
			width:win.width,
			height:win.height
		});
		win.add(imageView);
		
		// programatically hide the camera
		Ti.Media.hideCamera();
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
	autohide:false // tell the system not to auto-hide and we'll do it ourself
});