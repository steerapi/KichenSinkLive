(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/shake.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "shake.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;

var l = Titanium.UI.createLabel({
	text:'Shake your phone',
	top:10,
	color:'#999',
	height:'auto',
	width:'auto'
});

win.add(l);

Ti.Gesture.addEventListener('shake',function(e)
{
	Titanium.UI.createAlertDialog({title:'Shake',message:'it worked!'}).show();
});
