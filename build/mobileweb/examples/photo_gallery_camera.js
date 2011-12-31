(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/photo_gallery_camera.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "photo_gallery_camera.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
Ti.Media.showCamera({

	success:function(event)
	{
		var cropRect = event.cropRect;
		var image = event.media;
		
		Ti.Media.saveToPhotoGallery(image);
		
		Ti.UI.createAlertDialog({title:'Photo Gallery',message:'Check your photo gallery'}).show();		
	},
	cancel:function()
	{

	},
	error:function(error)
	{
		// create alert
		var a = Ti.UI.createAlertDialog({title:'Camera'});

		// set message
		if (error.code == Ti.Media.NO_CAMERA)
		{
			a.setMessage('Device does not have video recording capabilities');
		}
		else
		{
			a.setMessage('Unexpected error: ' + error.code);
		}

		// show alert
		a.show();
	},
	allowEditing:true
});