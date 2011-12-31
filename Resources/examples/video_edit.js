setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/video_edit.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "video_edit.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Ti.UI.currentWindow;

Ti.Media.startVideoEditing({
	media:'../movie.mp4',
	
	cancel:function()
	{
		alert("editing cancelled");
	},
	
	success:function(event)
	{
		var activeMovie = Titanium.Media.createVideoPlayer({
			media:event.media,
			backgroundColor:'#111',
			movieControlMode:Titanium.Media.VIDEO_CONTROL_DEFAULT,
			movieControlStyle:Titanium.Media.VIDEO_CONTROL_FULLSCREEN,
			scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FILL
		});
		win.add(activeMovie);
	},
	
	error:function(e)
	{
		alert("Error: "+e.error);
	}
});
