(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/tab_groups.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "tab_groups.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// get tab group object
var tabGroup = win.tabGroup;

//
//  ADD/REMOVE TAB
//
var addTabButton = Ti.UI.createButton({
	title:'Add/Remove Tab',
	top:10,
	height:40,
	width:200
});

// create button event listener
addTabButton.addEventListener('click', function(e)
{
	if (tabGroup.tabs.length == 5)
	{
		var win = Ti.UI.createWindow({title:'New Tab Window',barColor:'#000'});
		var newtab = Ti.UI.createTab({  
			icon:'../images/tabs/KS_nav_mashup.png',
			title:'New Tab',
			win:win
		});
		tabGroup.addTab(newtab);
	}
	else
	{
		var newtab = tabGroup.tabs[5];
		tabGroup.removeTab(newtab);
	}
});

//
// ANIMATE TAB GROUP
//
var animateTabButton = Ti.UI.createButton({
	title:'Animate Tab Group',
	top:60,
	height:40,
	width:200
});

var transformed = false;

// create button event listener
animateTabButton.addEventListener('click', function(e)
{
	if (transformed === false)
	{
		var transform = Ti.UI.create2DMatrix();
		transform = transform.scale(0.6);
		transform = transform.rotate(45);
		tabGroup.animate({transform:transform,duration:1000});

		transformed = true;
	}
	else
	{
		var transform = Ti.UI.create2DMatrix();
		tabGroup.animate({transform:transform,duration:1000});

		transformed = false;
	}
});


//
// CLOSE/OPEN TAB GROUP WITH ANIMATION 
// 
var closeTabGroupButton = Ti.UI.createButton({
	title:'Close/Animate Tab Group',
	top:110,
	height:40,
	width:200
});

closeTabGroupButton.addEventListener('click', function(e)
{
	tabGroup.animate({opacity:0,duration:1000}, function()
	{
		tabGroup.close();		
	});

});

//
// SET ACTIVE TAB (INDEX)
// 
var setActiveTabButton = Ti.UI.createButton({
	title:'Set Active Tab (Index)',
	top:160,
	height:40,
	width:200
});

setActiveTabButton.addEventListener('click', function(e)
{
	tabGroup.setActiveTab(1);
});

//
// SET ACTIVE TAB (OBJECT)
// 
var setActiveTabObjectButton = Ti.UI.createButton({
	title:'Set Active Tab (Object)',
	top:210,
	height:40,
	width:200
});
setActiveTabObjectButton.addEventListener('click', function(e)
{
	tabGroup.setActiveTab(tabGroup.tabs[1]);
});

//
// CUSTOMIZATION SWITCH - this allows or disables the ability for users to re-order tabs
//
var customizationButton = Ti.UI.createButton({
	title:'Switch customization off',
	top:260,
	height:40,
	width:200
});
customizationButton.addEventListener('click', function(e)
{
	var text = 'Switch customization ';
	if (tabGroup.allowUserCustomization) {
		tabGroup.allowUserCustomization = false;
		text += 'on';
	}
	else {
		tabGroup.allowUserCustomization = true;
		text += 'off';
	}
	customizationButton.title = text;
});


//
// CURRENT TAB GROUP
//
var openLabel = Ti.UI.createLabel({
	text:'Tab Group has ' + Ti.UI.currentTabGroup.tabs.length + ' tabs',
	color:'#999',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:310,
	width:'auto',
	height:'auto'
});

// add views based on platform
if (Ti.Platform.name == 'iPhone OS')
{
	win.add(addTabButton);
	win.add(animateTabButton);
	win.add(closeTabGroupButton);
	win.add(customizationButton);
}

win.add(setActiveTabButton);
win.add(setActiveTabObjectButton);
win.add(openLabel);