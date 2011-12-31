setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/movie_remote2.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "movie_remote2.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

// regression issue for #965

// dynamic url with dynamic encoding (from kosso)
var media_url = "http://phreadz.com/service/encoder.php?g=5LPOKP754&iph=1";
var win = Titanium.UI.currentWindow;

var activeMovie = Titanium.Media.createVideoPlayer({
	url:media_url,
	backgroundColor:'#111',
	movieControlMode:Titanium.Media.VIDEO_CONTROL_DEFAULT, // See TIMOB-2802, which may change this property name
	scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FILL
});

if (parseFloat(Titanium.Platform.version) >= 3.2)
{
	win.add(activeMovie);
}

activeMovie.play();

win.addEventListener('close', function() {
	alert("Window closed");
	activeMovie.stop();
});
