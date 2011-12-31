(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/image_view_updateimages.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "image_view_updateimages.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var _WhenStillImgs = [];
var _WhenMovingImgs = [];

_WhenStillImgs.push('../images/Kicking00.png');
_WhenStillImgs.push('../images/Kicking20.png');

_WhenMovingImgs.push('../images/Kicking00.png');
_WhenMovingImgs.push('../images/Kicking14.png');

var cartoonGuy =  Ti.UI.createImageView({
	height:200,
	width:200,
	images:_WhenStillImgs,
	duration:100, // in milliseconds, the time before next frame is shown
	repeatCount:0,  // 0 means animation repeats indefinitely, use > 1 to control repeat count
	top:30
});

win.add(cartoonGuy);

cartoonGuy.start();

cartoonGuy.addEventListener('touchstart', function(e)
{
	Ti.API.info('I WAS CLICKED');
	cartoonGuy.stop();
	cartoonGuy.images=_WhenMovingImgs;	
	cartoonGuy.start();
});

;