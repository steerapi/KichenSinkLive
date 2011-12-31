(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/toolbar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "toolbar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// initialize to all modes
win.orientationModes = [
	Ti.UI.PORTRAIT,
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

// create and add toolbar
var toolbar1 = Ti.UI.iOS.createToolbar({
	items:[flexSpace,camera, flexSpace,tf,flexSpace, send,flexSpace],
	bottom:0,
	borderTop:true,
	borderBottom:false,
	translucent:true,
	barColor:'#999'
});	
win.add(toolbar1);

var change = Ti.UI.createButton({
	title:'Change Toolbar',
	style:Ti.UI.iPhone.SystemButtonStyle.BORDERED		
});

var revert = Ti.UI.createButton({
	title:'Revert Toolbar',
	style:Ti.UI.iPhone.SystemButtonStyle.DONE		
});

//
//  Toolbar 2
//
var toolbar2 = Ti.UI.iOS.createToolbar({
	items:[change,flexSpace,revert],
	top:130,
	borderTop:true,
	borderBottom:true,
	barColor:'#336699'
});

change.addEventListener('click', function()
{
	toolbar2.borderTop = false;
	toolbar2.borderBottom = false;
	toolbar2.translucent = true;
	toolbar2.barColor = '#000';
	toolbar2.width = 300;
	
	change.width = "160";
	change.title = "Change Toolbar (!)";
});

revert.addEventListener('click', function()
{
	toolbar2.borderTop = true;
	toolbar2.borderBottom = true;
	toolbar2.barColor = '#336699';
	toolbar2.width = null;
	
	change.width = 0; // 0 means auto
	change.title = "Change Toolbar";
});

win.add(toolbar2);