(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/movie_local.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "movie_local.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var options = {
	url: '../movie.mp4',
	backgroundColor: '#111',
	scalingMode: Ti.Media.VIDEO_SCALING_MODE_FILL,
	movieControlMode: Ti.Media.VIDEO_CONTROL_NONE // See TIMOB-2802, which may change this property name
};

if (Ti.Platform.osname == "ipad") {
	options.width = 400;
	options.height = 300;
}

var activeMovie = Ti.Media.createVideoPlayer(options);
win.add(activeMovie);

// label 
var movieLabel = Ti.UI.createLabel({
	text:'Do not try this at home',
	width:'auto',
	height:35,
	color:'white',
	font:{fontSize:12,fontFamily:'Helvetica Neue'}
});

// add label to view
activeMovie.add(movieLabel);

// label click
movieLabel.addEventListener('click',function()
{
	movieLabel.text = "You clicked the video label. Sweet!";
	movieLabel.text = "mediaControlStyle = " + activeMovie.mediaControlStyle;
	if (Ti.Platform.name == 'iPhone OS') {
		movieLabel.text = movieLabel.text + " movieControlStyle = " + activeMovie.movieControlStyle;
	}
});

activeMovie.addEventListener('load', function()
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
	var dlg = Ti.UI.createAlertDialog({title:'Movie', message:'Completed!'});
	if (Ti.Platform.name === 'android') {
		// So you have a chance to see the "completed" dialog.
		win.close();
		dlg.show();
	} else {
		dlg.show();
		win.close();
	}
});

activeMovie.addEventListener('playbackState',function(e){
    Ti.API.info('Event PlaybackState Fired: '+e.playbackState);
    Ti.API.info('activeMovie.endPlaybackTime: '+activeMovie.endPlaybackTime);
    Ti.API.info('activeMovie.playableDuration: '+activeMovie.playableDuration);
});

activeMovie.play();

win.addEventListener('close', function() {
	activeMovie.stop();
});