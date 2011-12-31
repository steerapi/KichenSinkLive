(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/image_view_scaling.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "image_view_scaling.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;
var TIMEOUT_SECS = 2;

var imageView = Titanium.UI.createImageView({
	image:'http://www.appcelerator.com/wp-content/uploads/2009/06/titanium_desk.png',
	width: 325
});
	
win.add(imageView);

var l = Titanium.UI.createLabel({
	text:'fetching remote image...',
	bottom:30,
	color:'#999',
	height:100,
	right: 10,
	left: 10,
	textAlign:'center'
});
win.add(l);


function getDimensions() {
	l.text = 'retrieving dimensions...';
	var blob = imageView.toBlob();
	if (blob === null) {
		l.text = 'Unable to retrieve image dimensions. The image is a remote url -- are you connected to the network? Or the ' + TIMEOUT_SECS + ' second timeout expired. Tap here to try again.';
	} else {
		l.text = blob.width + "x" + blob.height;
		l.removeEventListener('click', getDimensions);
	}
}

l.addEventListener('click', getDimensions);

setTimeout(getDimensions, TIMEOUT_SECS * 1000); // give time for the remote image to load.

