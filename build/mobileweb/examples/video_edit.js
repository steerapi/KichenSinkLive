(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/video_edit.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "video_edit.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
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
		var activeMovie = Ti.Media.createVideoPlayer({
			media:event.media,
			backgroundColor:'#111',
			movieControlMode:Ti.Media.VIDEO_CONTROL_DEFAULT,
			movieControlStyle:Ti.Media.VIDEO_CONTROL_FULLSCREEN,
			scalingMode:Ti.Media.VIDEO_SCALING_MODE_FILL
		});
		win.add(activeMovie);
	},
	
	error:function(e)
	{
		alert("Error: "+e.error);
	}
});