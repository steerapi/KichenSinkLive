setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/camera_basic.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "camera_basic.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;
Titanium.Media.showCamera({

	success:function(event)
	{
		var cropRect = event.cropRect;
		var image = event.media;

		Ti.API.debug('Our type was: '+event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
		{
			var imageView = Ti.UI.createImageView({
				width:win.width,
				height:win.height,
				image:event.media
			});
			win.add(imageView);
		}
		else
		{
			alert("got the wrong type back ="+event.mediaType);
		}
	},
	cancel:function()
	{
	},
	error:function(error)
	{
		// create alert
		var a = Titanium.UI.createAlertDialog({title:'Camera'});

		// set message
		if (error.code == Titanium.Media.NO_CAMERA)
		{
			a.setMessage('Please run this test on device');
		}
		else
		{
			a.setMessage('Unexpected error: ' + error.code);
		}

		// show alert
		a.show();
	},
	saveToPhotoGallery:true,
	allowEditing:true,
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
});
