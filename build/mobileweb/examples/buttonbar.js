(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/buttonbar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "buttonbar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

//
//  LABEL
//
var l = Ti.UI.createLabel({
	text:'You have not clicked anything',
	color:'#777',
	font:{fontSize:13, fontFamily:'Helvetica Neue'},
	height:'auto',
	width:'auto'
});
win.add(l);

//
// BASIC BUTTON BAR
// 
var bb1 = Ti.UI.createButtonBar({
	labels:['One', 'Two', 'Three'],
	backgroundColor:'#336699',
	top:50,
	style:Ti.UI.iPhone.SystemButtonStyle.BAR,
	height:25,
	width:200
});

win.add(bb1);

//
// UPDATE LABELS AND DISPLAY BUTTON INDEX ON CLICK
//
var odd=true;
bb1.addEventListener('click', function(e)
{
	if (odd)
	{
		bb1.labels = ['Three','Four', 'Five'];
		odd=false;
	}
	else
	{
		bb1.labels = ['One','Two', 'Three'];
		odd=true;
	}
	l.text = 'You clicked index = ' + e.index;
});

//
// TOOLBAR
// 
var bb2 = Ti.UI.createButtonBar({
	labels:['One', 'Two', 'Three', 'Four', 'Five'],
	backgroundColor:'maroon'
});
var flexSpace = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

win.setToolbar([flexSpace,bb2,flexSpace]);

bb2.addEventListener('click', function(e)
{
	l.text = 'You clicked index = ' + e.index;
});

//
// NAVBAR
// 
var bb3 = Ti.UI.createButtonBar({
	labels:['One', 'Two'],
	backgroundColor:'#336699'
});

win.setRightNavButton(bb3);

bb3.addEventListener('click', function(e)
{
	l.text = 'You clicked index = ' + e.index;
});


//
// CUSTOM BUTTON BAR
// 
var buttonObjects = [
	{title:'Toggle Style', width:110, enabled:false},
	{image:'../images/slider_thumb.png', width:50},
	{title:'Toggle Enabled', width:140}
];
var bb4 = Ti.UI.createButtonBar({
	labels:buttonObjects,
	backgroundColor:'#000',
	top:100,
	style:Ti.UI.iPhone.SystemButtonStyle.BAR,
	height:40,
	width:'auto'
});

win.add(bb4);
var plain = false;
bb4.addEventListener('click', function(e)
{
	// toggle button bar style
	if (e.index == 1)
	{
		if (plain)
		{
			bb4.style = Ti.UI.iPhone.SystemButtonStyle.BAR;
			plain=false;
		}
		else
		{
			bb4.style = Ti.UI.iPhone.SystemButtonStyle.PLAIN;
			plain=true;
		}
	}
	
	// toggle enabled
	else if (e.index == 2)
	{
		buttonObjects[0].enabled = (buttonObjects[0].enabled === false)?true:false;
		bb4.labels = buttonObjects;		
	}
	l.text = 'You clicked index = ' + e.index;
});