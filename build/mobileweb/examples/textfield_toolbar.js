(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield_toolbar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield_toolbar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

win.orientationModes = [
	Ti.UI.PORTRAIT,
	Ti.UI.UPSIDE_PORTRAIT,
	Ti.UI.LANDSCAPE_LEFT,
	Ti.UI.LANDSCAPE_RIGHT
]; 

var flexSpace = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var tf = Ti.UI.createTextField({
	height:32,
	backgroundImage:'../images/inputfield.png',
	width:200,
	font:{fontSize:13},
	color:'#777',
	paddingLeft:10,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE
});

var camera = Ti.UI.createButton({
	backgroundImage:'../images/camera.png',
	height:33,
	width:33
});
camera.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'Toolbar',message:'You clicked camera!'}).show();
});

var send = Ti.UI.createButton({
	backgroundImage:'../images/send.png',
	backgroundSelectedImage:'../images/send_selected.png',
	width:67,
	height:32
});
send.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'Toolbar',message:'You clicked send!'}).show();
});


var textfield = Ti.UI.createTextField({
	color:'#336699',
	value:'Focus to see keyboard w/ toolbar',
	height:35,
	width:300,
	top:10,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	keyboardToolbar:[flexSpace,camera, flexSpace,tf,flexSpace, send,flexSpace],
	keyboardToolbarColor: '#999',	
	keyboardToolbarHeight: 40
});

var textfield2 = Ti.UI.createTextField({
	color:'#336699',
	value:'Focus to see keyboard w/o toolbar',
	height:35,
	width:300,
	top:70,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});



win.add(textfield);
win.add(textfield2);


;