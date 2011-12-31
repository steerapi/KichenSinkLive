(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/movie_embed.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "movie_embed.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var statusLabel = Ti.UI.createLabel({
	text:'tap on movie content',
	width:'auto',
	bottom:50,
	font:{fontSize:12,fontFamily:'Helvetica Neue'}
});
win.add(statusLabel);

var activeMovie = Ti.Media.createVideoPlayer({
	url:'../movie.mp4',
	backgroundColor:'#111',
	movieControlMode: Ti.Media.VIDEO_CONTROL_EMBEDDED, // See TIMOB-2802, which may change this property name
	scalingMode:Ti.Media.VIDEO_SCALING_MODE_FILL,
	width:100,
	height:100,
	autoplay:true
});

// The built-in media playback controls look crazy at 100x100 in Android
if (Ti.Platform.name === "android") {
	activeMovie.width = 250;
	activeMovie.height = 250;
}

win.add(activeMovie);

// label 
var movieLabel = Ti.UI.createLabel({
	text:'Do not try this at home',
	width:'auto',
	height:25,
	color:'white',
	font:{fontSize:18,fontFamily:'Helvetica Neue'}
});

// add label to view
activeMovie.add(movieLabel);

// movie click
activeMovie.addEventListener('click',function()
{
	var newText = "";
	newText += " initialPlaybackTime: " + activeMovie.initialPlaybackTime;
	newText += "; playableDuration: " + activeMovie.playableDuration;
	newText += "; endPlaybackTime: " + activeMovie.endPlaybackTime;
	newText += "; duration: " + activeMovie.duration;
	newText += "; currentPlaybackTime: " + activeMovie.currentPlaybackTime;
	statusLabel.text = newText;
});

// label click
movieLabel.addEventListener('click',function()
{
	movieLabel.text = "You clicked the video label. Sweet!";
});

activeMovie.addEventListener('load',function()
{
	// animate label
	var t = Ti.UI.create2DMatrix();
	t = t.scale(3);
	movieLabel.animate({transform:t, duration:500, color:'red'},function()
	{
		var t = Ti.UI.create2DMatrix();
		movieLabel.animate({transform:t, duration:500, color:'white'});
	});
});
activeMovie.addEventListener('complete',function()
{
	Ti.API.debug('Completed!');
	var dlg = Ti.UI.createAlertDialog({title:'Movie', message:'Completed!'});
	if (Ti.Platform.name === "android") {
		// Gives a chance to see the dialog
		win.close();
		dlg.show();
	} else {
		dlg.show();
		win.close();
	}
});

if (Ti.Platform.name !== "android") {
	// Thumbnails not supported
	var thumbnailImage = activeMovie.thumbnailImageAtTime(4.0, Ti.Media.VIDEO_TIME_OPTION_EXACT);
	win.add(Ti.UI.createImageView({
		image:thumbnailImage,
		bottom:10,
		width:100,
		height:100
	}));
}

activeMovie.play();

win.addEventListener('close', function() {
	activeMovie.stop();
});