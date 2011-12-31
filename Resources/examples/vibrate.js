(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/vibrate.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "vibrate.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;
// initialize to all modes
win.orientationModes = [
	Titanium.UI.PORTRAIT,
	Titanium.UI.LANDSCAPE_LEFT,
	Titanium.UI.LANDSCAPE_RIGHT
];
var b1 = Titanium.UI.createButton({
	title:'Vibrate',
	height:40,
	width:300,
	top:10
});

win.add(b1);

b1.addEventListener('click', function()
{
	Titanium.Media.vibrate();	
});
