(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/xhr_binarydata.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "xhr_binarydata.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var l = Ti.UI.createLabel({
	text:'Downloading image...',
	font:{fontSize:13},
	top:10,
	left:10,
	width:300,
	color:'#888'
});
win.add(l);
var imageView = Ti.UI.createImageView({
	top:50,
	left:10,
	height:100,
	width:80
});
win.add(imageView);

var xhr = Ti.Network.createHTTPClient();

xhr.onload = function()
{
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'ti.png');
	f.write(this.responseData);
	imageView.image = f.nativePath;
};
// open the client (and test HTTPS)
xhr.open('GET','https://www.appcelerator.com/wp-content/uploads/2009/06/titanium_desk.png');

// send the data
xhr.send();