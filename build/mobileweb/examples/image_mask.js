(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/image_mask.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "image_mask.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundColor = '#ccc';

// put the image mask (which must be non-transparent, black) in the back
var mask = Ti.UI.createMaskedImage({
	image:'../images/body-mask.png',
	tint: 'brown',
	mode: Ti.UI.iOS.BLEND_MODE_SOURCE_IN
});

// layer on top the image that is transparent that you want to blend
var image = Ti.UI.createMaskedImage({
	image:'../images/body.png',
	tint: 'black',
	mode: Ti.UI.iOS.BLEND_MODE_SOURCE_IN
});


// now create some buttons to dynamically change the color of the body

var btn1 = Ti.UI.createView({
	right:10,
	width:40,
	height:40,
	bottom:110,
	backgroundColor:'white',
	borderColor:'black'
});

var btn2 = Ti.UI.createView({
	right:10,
	width:40,
	height:40,
	bottom:60,
	backgroundColor:'brown',
	borderColor:'black'
});

var btn3 = Ti.UI.createView({
	right:10,
	width:40,
	height:40,
	bottom:10,
	backgroundColor:'black',
	borderColor:'black'
});

win.add(mask);
win.add(image);

win.add(btn1);
win.add(btn2);
win.add(btn3);


btn1.addEventListener('click',function()
{
	mask.tint = 'white';
});

btn2.addEventListener('click',function()
{
	mask.tint = 'brown';
});

btn3.addEventListener('click',function()
{
	mask.tint = '#666';
});

;