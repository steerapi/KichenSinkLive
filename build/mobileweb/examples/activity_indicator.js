(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/activity_indicator.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "activity_indicator.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundColor = '#13386c';

//
// BASE INDICATOR
//
var actInd = Ti.UI.createActivityIndicator({
	bottom:10, 
	height:50,
	width:10,
	style:Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

var button0 = Ti.UI.createButton({
	title:'Hide',
	height:35,
	width:130,
	top:10,
	right:20
});

button0.addEventListener('click', function()
{
	actInd.message = null;
	actInd.hide();
});


//
// BASIC ACTIVITY INDICATOR
//
var button1 = Ti.UI.createButton({
	title:'Show (Basic)',
	height:35,
	width:130,
	top:10,
	left:20
});

button1.addEventListener('click', function()
{
	actInd.show();
});


//
// ACTIVITY INDICATOR (BIG)
//
var button2 = Ti.UI.createButton({
	title:'Show Indicator (BIG)',
	height:35,
	width:200,
	top:55
});

button2.addEventListener('click', function()
{
	actInd.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	actInd.show();
});

//
// ACTIVITY INDICATOR (DARK)
//
var button3 = Ti.UI.createButton({
	title:'Show Indicator (DARK)',
	height:35,
	width:200,
	top:100
});

button3.addEventListener('click', function()
{
	actInd.style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	actInd.show();
});

//
// ACTIVITY INDICATOR (MESSAGE)
//
var button4 = Ti.UI.createButton({
	title:'Show Indicator (Message)',
	height:35,
	width:200,
	top:145
});

button4.addEventListener('click', function()
{
	actInd.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	actInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	actInd.color = 'white';
	actInd.message = 'Loading...';
	actInd.width = 210;
	actInd.show();
});

//
// ACTIVITY INDICATOR (TOOLBAR)
//
var toolActInd = Ti.UI.createActivityIndicator();

var button5 = Ti.UI.createButton({
	title:'Show Indicator (Toolbar)',
	height:35,
	width:200,
	top:190
});

button5.addEventListener('click', function()
{
	toolActInd.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	toolActInd.color = 'white';
	toolActInd.message = 'Loading...';
	win.setToolbar([toolActInd],{animated:true});
	toolActInd.show();
	setTimeout(function()
	{
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
	},3000);

});

//
// ACTIVITY INDICATOR (NAVBAR)
//
var navActInd = Ti.UI.createActivityIndicator();

var button6 = Ti.UI.createButton({
	title:'Show Indicator (Navbar)',
	height:35,
	width:200,
	top:235
});

button6.addEventListener('click', function()
{
	
	win.setRightNavButton(navActInd);
	navActInd.show();
	setTimeout(function()
	{
		navActInd.hide();
		win.setRightNavButton(null);
	
	},3000);

});

//
// ACTIVITY INDICATOR (TITLE CONTROL)
//
var button7 = Ti.UI.createButton({
	title:'Show Indicator (Title)',
	height:35,
	width:200,
	top:280
});

button7.addEventListener('click', function()
{
	win.setTitleControl(actInd);
	actInd.show();

	setTimeout(function()
	{
		actInd.hide();
		win.setTitleControl(null);
		win.title = 'Activity Indicator';

	},3000);
});

win.add(actInd);

// add iphone elements
if (Ti.Platform.name == 'iPhone OS')
{
	win.add(button1);
	win.add(button0);
	win.add(button2);
	win.add(button3);
	win.add(button4);
	win.add(button5);
	win.add(button6);
	win.add(button7);
}
else
{
	actInd.show();
	actInd.message = 'Loading...';
	setTimeout(function()
	{
		actInd.hide();
	},2000);
}
;