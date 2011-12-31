(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/camera_file.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "camera_file.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;


Ti.Media.showCamera({

	success:function(event)
	{
		var cropRect = event.cropRect;
		var image = event.media;
		
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'camera_photo.png');
		f.write(image);
		win.backgroundImage = f.nativePath;
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