(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/screenshot.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "screenshot.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var imageView = Ti.UI.createImageView({
	height:200,
	width:200,
	top:20,
	left:10,
	backgroundColor:'#999'
});

win.add(imageView);

Ti.Media.takeScreenshot(function(event)
{
	// set blob on image view
	imageView.image = event.media;
	win.setBackgroundColor('red');

	var a = Ti.UI.createAlertDialog();

	// set title
	a.setTitle('Screenshot');

	// set message
	a.setMessage('See screenshot of this page');

	// set button names
	a.setButtonNames(['OK']);

	// show alert
	a.show();
});