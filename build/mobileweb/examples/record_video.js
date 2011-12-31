(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/record_video.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "record_video.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var b = Ti.UI.createButton({
	title:'Record Movie',
	width:200,
	height:40,
	top:20
});
win.add(b);

b.addEventListener('click', function()
{
	if (b.title == 'Play Movie')
	{
		var activeMovie = Ti.Media.createVideoPlayer({
			backgroundColor:'#111',
			movieControlMode:Ti.Media.VIDEO_CONTROL_DEFAULT,
			scalingMode:Ti.Media.VIDEO_SCALING_ASPECT_FILL,
			//contentURL:movieFile.nativePath
			media:movieFile			// note you can use either contentURL to nativePath or the file object
		});
		activeMovie.play();

		activeMovie.addEventListener('complete', function()
		{
			movieFile.deleteFile();
			b.title = 'Record Movie';
		});
		
		if (parseFloat(Ti.Platform.version) >= 3.2)
		{
			win.add(activeMovie);
		}
	}
	else
	{
		Ti.Media.showCamera({

			success:function(event)
			{
				var video = event.media;
				movieFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'mymovie.mov');
				movieFile.write(video);
				b.title = 'Play Movie';
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
	
	}
	
});

;