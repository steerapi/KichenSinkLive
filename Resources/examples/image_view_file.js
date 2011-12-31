(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/image_view_file.js");
  xhr = Titanium.Network.createHTTPClient();
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
var win = Titanium.UI.currentWindow;

var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/apple_logo.jpg');

var imageView = Titanium.UI.createImageView({
	image:f,
	width:24,
	height:24,
	top:100
});

win.add(imageView);

var l = Titanium.UI.createLabel({
	text:'Click Image of Apple Logo',
	bottom:20,
	width:'auto',
	height:'auto',
	color:'#999'
});
win.add(l);

imageView.addEventListener('click', function()
{
	Titanium.UI.createAlertDialog({title:'Image View', message:'You clicked me!'}).show();
});