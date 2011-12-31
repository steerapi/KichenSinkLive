(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/app_events.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "app_events.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;


var label = Ti.UI.createLabel({
	text:'No app event received. Make call while running app',
	textAlign:'center',
	width:'auto'
});

win.add(label);

var paused = false;

Ti.App.addEventListener('pause',function(e)
{
	paused = true;
	label.text = "App has been paused";
});

Ti.App.addEventListener('resume',function(e)
{
	if (paused)
	{
		label.text = "App has resumed";
	}
	else
	{
		label.text = "App has resumed (w/o pause)";
	}
});


;