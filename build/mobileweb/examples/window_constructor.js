(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/window_constructor.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "window_constructor.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var label = Ti.UI.createLabel({
	text:'This test decorates a window pre-open',
	top:10,
	width:'auto',
	height:'auto'
});
Ti.UI.currentWindow.add(label);

var button = Ti.UI.createButton({
	title:'Open new window',
	top:40,
	height:40,
	width:200
});
Ti.UI.currentWindow.add(button);

button.addEventListener('click', function(e)
{
	var bb = Ti.UI.createButtonBar({
		labels:['One', 'Two'],
		backgroundColor:'#336699'
	});
	bb.addEventListener('click', function(e)
	{
		Ti.UI.createAlertDialog({title:'Button Bar', message:'You clicked ' + e.index}).show();
	});
	
	//
	// create window with right nav button 
	//
	var win = Ti.UI.createWindow({
		rightNavButton:bb,
		backgroundColor:'#13386c',
		barColor:'#336699',
		translucent:true,
		titleImage:'../images/slider_thumb.png'
	});
	
	var winview = Ti.UI.createView({backgroundColor:'yellow'});
	win.add(winview);

	//
	//  create toolbar buttons
	//
	var a = Ti.UI.createButton({
		title:'Left',
		width:75,
		style:Ti.UI.iPhone.SystemButtonStyle.BORDERED		
	});
	a.addEventListener('click', function(e)
	{
		Ti.UI.createAlertDialog({title:'Toolbar', message:'You clicked Left'}).show();
	});
	
	var b = Ti.UI.createButton({
		title:'Right',
		width:75,
		style:Ti.UI.iPhone.SystemButtonStyle.BORDERED		
	});
	b.addEventListener('click', function(e)
	{
		Ti.UI.createAlertDialog({title:'Toolbar', message:'You clicked Right'}).show();
	});

	var flexSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var fixedSpace = Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FIXED_SPACE,
		width:50
	});

	// set toolbar
	win.setToolbar([flexSpace,a,fixedSpace,b,flexSpace],{translucent:true});

	Ti.UI.currentTab.open(win,{animated:true});	
});

;