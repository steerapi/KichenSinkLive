(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/options_dialog.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "options_dialog.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

win.orientationModes = [
	Ti.UI.PORTRAIT,
	Ti.UI.LANDSCAPE_LEFT,
	Ti.UI.LANDSCAPE_RIGHT
]; 

var isAndroid = Ti.Platform.osname == 'android';

if (isAndroid) {
	var showCancel = Ti.UI.createSwitch({
		style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
		title: 'Show Cancel Button',
		top : 160
	});
	
	var applyButtons = function() 
	{
		if (showCancel.value) {
			dialog.buttonNames = [ 'Cancel'];
		} else {
			dialog.buttonNames = [];
		}
	};
}
//
// BASIC OPTIONS DIALOG
//

var optionsDialogOpts = {
	options:['Option 1', 'Option 2', 'Option 3'],
	destructive:1,
	cancel:2,
	title:'I am a title'
};

if (isAndroid) {
	optionsDialogOpts.selectedIndex = 3;
}

var dialog = Ti.UI.createOptionDialog(optionsDialogOpts);

// add event listener
dialog.addEventListener('click',function(e)
{
	label.text = 'You selected ' + e.index;
	
	if (isAndroid) {
		if (e.button) {
			label.text += ' button';
		}  else {
			label.text += ' option';
		}
	}
});

// BUTTON TO SHOW BASIC DIALOG
var button1 = Ti.UI.createButton({
	title:'Show Dialog 1',
	height:40,
	width:200,
	top:10
});
button1.addEventListener('click', function()
{
	if (isAndroid) {
		dialog.androidView = null;
		applyButtons();
	}
	dialog.show();
});

// BUTTON TO MODIFY DIALOG AND SHOW
var button2 = Ti.UI.createButton({
	title:'Modify and Show Dialog',
	height:40,
	width:200,
	top:60
});
button2.addEventListener('click', function()
{
	dialog.title = 'I changed the title';
	dialog.options = ['New Option 1', 'New Option 2', 'New Option 3', 'New Option 4'];
	dialog.destructive = 0;
	dialog.cancel = 3;
	if (isAndroid) {
		dialog.androidView = null;
		applyButtons();
	}
	dialog.show();
});

// label that shows clicked option
var label = Ti.UI.createLabel({
	text:'No selection' ,
	color:'#999',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:110,
	width:300
});

if (isAndroid) {
	// BUTTON TO MODIFY DIALOG TO USE A VIEW AND SHOW
	var button3 = Ti.UI.createButton({
		title:'Modify and Show Dialog',
		height:40,
		width:200,
		top:220
	});
	button3.addEventListener('click', function()
	{
		// For now, you must give the containing view dimensions in order for it to appear.
		var root = Ti.UI.createView({});
		
		var view = Ti.UI.createView({
			width : 300, height: '100'
		});
		root.add(view);
		var l = Ti.UI.createLabel({
			text : 'I am a label',
			top: 10, left: 10, bottom: 10, right: 10,
			color : 'white',
			borderRadius : 10,
			backgroundColor : 'blue'
		}); 
		view.add(l);
		
		dialog.title = 'Android with a View';
		dialog.options = null;
		dialog.buttonNames = ['OK'];
		dialog.androidView = root;
		dialog.show();
	});
}


win.add(button1);
win.add(button2);
win.add(label);

if (isAndroid) {
	win.add(showCancel);
	win.add(button3);
};