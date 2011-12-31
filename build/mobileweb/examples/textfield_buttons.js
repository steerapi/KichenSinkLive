(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield_buttons.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield_buttons.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//		modes for rightButtonMode,clearButtonMode and leftButtonMode
//		Ti.UI.INPUT_BUTTONMODE_NEVER
//		Ti.UI.INPUT_BUTTONMODE_ALWAYS
//		Ti.UI.INPUT_BUTTONMODE_ONFOCUS
//		Ti.UI.INPUT_BUTTONMODE_ONBLUR



var win = Ti.UI.currentWindow;

var leftButton = Ti.UI.createButton({
	style:Ti.UI.iPhone.SystemButton.DISCLOSURE
});
var rightButton = Ti.UI.createButton({
	style:Ti.UI.iPhone.SystemButton.INFO_DARK
});

leftButton.addEventListener('click',function()
{
	Ti.UI.createAlertDialog({
		title:'Text Fields',
		message:'You clicked the left button'
	}).show();
});

rightButton.addEventListener('click',function()
{
	Ti.UI.createAlertDialog({
		title:'Text Fields',
		message:'You clicked the right button'
	}).show();
});


var tf1 = Ti.UI.createTextField({
	color:'#336699',
	height:35,
	top:10,
	left:10,
	width:250,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	leftButton:leftButton,
	rightButton:rightButton,
	leftButtonMode:Ti.UI.INPUT_BUTTONMODE_ALWAYS,
	rightButtonMode:Ti.UI.INPUT_BUTTONMODE_ONFOCUS
});

win.add(tf1);