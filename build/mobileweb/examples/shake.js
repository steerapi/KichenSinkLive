(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/shake.js");
  xhr = Ti.Network.createHTTPClient();
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
var win = Ti.UI.currentWindow;

var l = Ti.UI.createLabel({
	text:'Shake your phone',
	top:10,
	color:'#999',
	height:'auto',
	width:'auto'
});

win.add(l);

Ti.Gesture.addEventListener('shake',function(e)
{
	Ti.UI.createAlertDialog({title:'Shake',message:'it worked!'}).show();
});