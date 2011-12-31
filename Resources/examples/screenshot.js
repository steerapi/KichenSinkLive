setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/screenshot.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "screenshot.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;

var imageView = Titanium.UI.createImageView({
	height:200,
	width:200,
	top:20,
	left:10,
	backgroundColor:'#999'
});

win.add(imageView);

Titanium.Media.takeScreenshot(function(event)
{
	// set blob on image view
	imageView.image = event.media;
	win.setBackgroundColor('red');

	var a = Titanium.UI.createAlertDialog();

	// set title
	a.setTitle('Screenshot');

	// set message
	a.setMessage('See screenshot of this page');

	// set button names
	a.setButtonNames(['OK']);

	// show alert
	a.show();
});
