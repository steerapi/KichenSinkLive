setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/textfield_buttons.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "textfield_buttons.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

//		modes for rightButtonMode,clearButtonMode and leftButtonMode
//		Titanium.UI.INPUT_BUTTONMODE_NEVER
//		Titanium.UI.INPUT_BUTTONMODE_ALWAYS
//		Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
//		Titanium.UI.INPUT_BUTTONMODE_ONBLUR



var win = Titanium.UI.currentWindow;

var leftButton = Titanium.UI.createButton({
	style:Titanium.UI.iPhone.SystemButton.DISCLOSURE
});
var rightButton = Titanium.UI.createButton({
	style:Titanium.UI.iPhone.SystemButton.INFO_DARK
});

leftButton.addEventListener('click',function()
{
	Titanium.UI.createAlertDialog({
		title:'Text Fields',
		message:'You clicked the left button'
	}).show();
});

rightButton.addEventListener('click',function()
{
	Titanium.UI.createAlertDialog({
		title:'Text Fields',
		message:'You clicked the right button'
	}).show();
});


var tf1 = Titanium.UI.createTextField({
	color:'#336699',
	height:35,
	top:10,
	left:10,
	width:250,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	leftButton:leftButton,
	rightButton:rightButton,
	leftButtonMode:Titanium.UI.INPUT_BUTTONMODE_ALWAYS,
	rightButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});

win.add(tf1);
