(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/movie_remote2.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "movie_remote2.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// regression issue for #965

// dynamic url with dynamic encoding (from kosso)
var media_url = "http://phreadz.com/service/encoder.php?g=5LPOKP754&iph=1";
var win = Ti.UI.currentWindow;

var activeMovie = Ti.Media.createVideoPlayer({
	url:media_url,
	backgroundColor:'#111',
	movieControlMode:Ti.Media.VIDEO_CONTROL_DEFAULT, // See TIMOB-2802, which may change this property name
	scalingMode:Ti.Media.VIDEO_SCALING_MODE_FILL
});

if (parseFloat(Ti.Platform.version) >= 3.2)
{
	win.add(activeMovie);
}

activeMovie.play();

win.addEventListener('close', function() {
	alert("Window closed");
	activeMovie.stop();
});