(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/record_video.js");
  xhr = Titanium.Network.createHTTPClient();
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
var win = Titanium.UI.currentWindow;

var b = Titanium.UI.createButton({
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
		var activeMovie = Titanium.Media.createVideoPlayer({
			backgroundColor:'#111',
			movieControlMode:Titanium.Media.VIDEO_CONTROL_DEFAULT,
			scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FILL,
			//contentURL:movieFile.nativePath
			media:movieFile			// note you can use either contentURL to nativePath or the file object
		});
		activeMovie.play();

		activeMovie.addEventListener('complete', function()
		{
			movieFile.deleteFile();
			b.title = 'Record Movie';
		});
		
		if (parseFloat(Titanium.Platform.version) >= 3.2)
		{
			win.add(activeMovie);
		}
	}
	else
	{
		Titanium.Media.showCamera({

			success:function(event)
			{
				var video = event.media;
				movieFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'mymovie.mov');
				movieFile.write(video);
				b.title = 'Play Movie';
			},
			cancel:function()
			{

			},
			error:function(error)
			{
				// create alert
				var a = Titanium.UI.createAlertDialog({title:'Video'});

				// set message
				if (error.code == Titanium.Media.NO_VIDEO)
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
			mediaTypes: Titanium.Media.MEDIA_TYPE_VIDEO,
			videoMaximumDuration:10000,
			videoQuality:Titanium.Media.QUALITY_HIGH
		});
	
	}
	
});

