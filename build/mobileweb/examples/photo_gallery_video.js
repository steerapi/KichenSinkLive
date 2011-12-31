(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/photo_gallery_video.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "photo_gallery_video.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
Ti.Media.showCamera({

	success:function(event)
	{
		var video = event.media;
		Ti.Media.saveToPhotoGallery(video,{
			success: function(e) {
				Ti.UI.createAlertDialog({
					title:'Photo Gallery',
					message:'Check your photo gallery for your video'
				}).show();		
			},
			error: function(e) {
				Ti.UI.createAlertDialog({
					title:'Error saving',
					message:e.error
				}).show();
			}
		});
	},
	cancel:function()
	{

	},
	error:function(error)
	{
		// create alert
		var a = Ti.UI.createAlertDialog({title:'Video'});

		// set message
		if (error.code == Ti.Media.NO_VIDEO)
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
	mediaTypes: Ti.Media.MEDIA_TYPE_VIDEO,
	videoMaximumDuration:10000,
	videoQuality:Ti.Media.QUALITY_HIGH
});