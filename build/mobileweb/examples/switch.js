(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/switch.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "switch.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

//
// BASIC SWITCH
//
var basicSwitchLabel = Ti.UI.createLabel({
	text:'Basic Switch value = false' ,
	color:'#999',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:10,
	height:'auto'
});

var basicSwitch = Ti.UI.createSwitch({
	value:false,
	top:30
});

basicSwitch.addEventListener('change',function(e)
{
	basicSwitchLabel.text = 'Basic Switch value = ' + e.value + ' act val ' + basicSwitch.value;
});

//
// CHANGE SWITCH
//
var changeButton = Ti.UI.createButton({
	title:'Change Switch',
	height:40,
	width:200,
	top:90
});
changeButton.addEventListener('click', function()
{
	if (basicSwitch.value === false)
	{
		basicSwitch.value = true;
	}
	else
	{
		basicSwitch.value = false;
	}
});

//
// HIDE/SHOW SWITCH
//
var hideShowButton = Ti.UI.createButton({
	title:'Hide/Show Switch',
	height:40,
	width:200,
	top:140
});
var hidden=false;
hideShowButton.addEventListener('click', function()
{
	if (hidden === true)
	{
		basicSwitch.show();
		hidden=false;
	}
	else
	{
		basicSwitch.hide();
		hidden=true;
	}
});

//
// SWITCH IN TOOLBAR
//
var toolbarButton = Ti.UI.createButton({
	title:'Toggle Switch in Toolbar',
	height:40,
	width:200,
	top:240
});
var inToolbar = false;
toolbarButton.addEventListener('click', function()
{
	if (!inToolbar)
	{
		var toolbarSwitch = Ti.UI.createSwitch({
			value:false
		});
		win.setToolbar([toolbarSwitch]);
		inToolbar = true;
	}
	else
	{
		inToolbar = false;
		win.setToolbar(null,{animated:true});
	}
});

//
// SWITCH IN NAVBAR
//
var navbarButton = Ti.UI.createButton({
	title:'Toggle Switch in Navbar',
	height:40,
	width:200,
	top:190
});
var inNavbar = false;
navbarButton.addEventListener('click', function()
{
	if (!inNavbar)
	{
		var navbarSwitch = Ti.UI.createSwitch({
			value:false
		});
		win.setRightNavButton(navbarSwitch);
		inNavbar =true;
	}
	else
	{
		win.rightNavButton = null;
		inNavbar = false;
	}
});

//
// SWITCH TO TITLE CONTROL
//
var titleButton = Ti.UI.createButton({
	title:'Toggle Swtich in Title',
	height:40,
	width:200,
	top:290
});


var inTitle = false;
titleButton.addEventListener('click', function()
{
	if (inTitle)
	{
		win.titleControl = null;
		win.title = 'Switch';
		inTitle=false;
	}
	else
	{
		var titleSwitch = Ti.UI.createSwitch({
			value:false
		});
		win.titleControl = titleSwitch;
		inTitle=true;
	}
});

win.add(basicSwitchLabel);
win.add(basicSwitch);
win.add(changeButton);
win.add(hideShowButton);

if (Ti.Platform.name == 'iPhone OS')
{
	win.add(toolbarButton);
	win.add(navbarButton);
	win.add(titleButton);
}

if (Ti.Platform.osname == 'android')
{
	//
	// CHECKBOX
	//
	var checkBox = Ti.UI.createSwitch({
			style:Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
			title:"CheckBox: " + false,
			value:false,
			top:190,
			left:60
	});
	checkBox.addEventListener('change', function(e) {
		checkBox.title = "CheckBox: " + e.value;
	});
	
	//
	// TOGGLEBUTTON W/ TITLE
	//
	var titleSwitch = Ti.UI.createSwitch({
			style:Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
			titleOff:"LO",
			titleOn:"HI",
			value:false,
			top:240
	});

	win.add(checkBox);
	win.add(titleSwitch);
}
;