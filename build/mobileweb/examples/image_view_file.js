(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/image_view_file.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "image_view_file.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'images/apple_logo.jpg');

var imageView = Ti.UI.createImageView({
	image:f,
	width:24,
	height:24,
	top:100
});

win.add(imageView);

var l = Ti.UI.createLabel({
	text:'Click Image of Apple Logo',
	bottom:20,
	width:'auto',
	height:'auto',
	color:'#999'
});
win.add(l);

imageView.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'Image View', message:'You clicked me!'}).show();
});