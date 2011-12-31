(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/photo_gallery_camera.js");
  xhr = Titanium.Network.createHTTPClient();
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
Titanium.Media.showCamera({

	success:function(event)
	{
		var cropRect = event.cropRect;
		var image = event.media;
		
		Titanium.Media.saveToPhotoGallery(image);
		
		Titanium.UI.createAlertDialog({title:'Photo Gallery',message:'Check your photo gallery'}).show();		
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
