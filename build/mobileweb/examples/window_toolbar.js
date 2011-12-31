(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/window_toolbar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "window_toolbar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// current window
var win = Ti.UI.currentWindow;

//
// SINGLE BUTTON ON LEFT
//
var b1 = Ti.UI.createButton({
	title:'One Button - Left',
	width:200,
	height:40,
	top:10
});
b1.addEventListener('click', function()
{
	var b = Ti.UI.createButton({
		title:'Button',
		style:Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		enabled:false
	});
	b.enabled = false;
	b.addEventListener('click', function() {
		Ti.API.info('Clicked left button!');
	});
	win.setToolbar([b]);
});
win.add(b1);

//
// SET BUTTON ON RIGHT
//
var b2 = Ti.UI.createButton({
	title:'One Button - Right',
	width:200,
	height:40,
	top:60
});
b2.addEventListener('click', function()
{
	var b = Ti.UI.createButton({
		title:'Button',
		style:Ti.UI.iPhone.SystemButtonStyle.DONE
	});
	var flexSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	b.addEventListener('click', function() {
		Ti.API.info('Clicked right button!');
	});
	win.setToolbar([flexSpace,b]);
});
win.add(b2);

//
// SET BUTTON IN MIDDLE
//
var b3 = Ti.UI.createButton({
	title:'One Button - MIDDLE',
	width:200,
	height:40,
	top:110
});
b3.addEventListener('click', function()
{
	var b = Ti.UI.createButton({
		title:'Button',
		style:Ti.UI.iPhone.SystemButtonStyle.DONE
	});
	var flexSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	win.setToolbar([flexSpace,b,flexSpace]);
});
win.add(b3);

//
// FIXED SPACE BUTTONs
//
var b4 = Ti.UI.createButton({
	title:'Fixed Space',
	width:200,
	height:40,
	top:160
});
b4.addEventListener('click', function()
{
	var a = Ti.UI.createButton({
		title:'Left',
		width:75,
		style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	var b = Ti.UI.createButton({
		title:'Right',
		width:75,
		style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	var flexSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var fixedSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FIXED_SPACE,
		width:50
	});
	win.setToolbar([flexSpace,a,fixedSpace,b,flexSpace]);
});
win.add(b4);

//
// HIDE TOOLBAR
//
var b5 = Ti.UI.createButton({
	title:'Hide Toolbar',
	width:200,
	height:40,
	top:210
});
b5.addEventListener('click', function()
{
	win.setToolbar(null,{animated:true});
});
win.add(b5);


//
// BACKGROUND IMAGE ON NORMAL BUTTON
//
var b7 = Ti.UI.createButton({
	title:'Button With Image',
	height:40,
	width:200,
	top:260
});
b7.addEventListener('click', function()
{
	var b = Ti.UI.createButton({
		backgroundImage:'../images/camera.png',
		height:33,
		width:33
	});
	var flexSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	win.setToolbar([flexSpace,b,flexSpace]);
});
win.add(b7);

var b8 = Ti.UI.createButton({
	title:'Set Label',
	height:40,
	width:200,
	top:310
});

b8.addEventListener('click', function()
{
	var l = Ti.UI.createLabel({
		text:'Hello',
		color:'#fff',
		font:{fontSize:14}
	});
	var flexSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	win.setToolbar([flexSpace,l,flexSpace]);

});
win.add(b8);

;