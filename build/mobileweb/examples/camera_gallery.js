(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/camera_gallery.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "camera_gallery.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;


Ti.Media.showCamera({

	success:function(event)
	{
		Ti.UI.createAlertDialog({title:'Camera', message:'Check your Photo Gallery'}).show();
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
	saveToPhotoGallery:true,
	allowEditing:true
});