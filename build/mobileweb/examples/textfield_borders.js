(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield_borders.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield_borders.js",
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

var scrolly = Ti.UI.createScrollView({contentHeight:'auto'});
win.add(scrolly);

var tf1 = Ti.UI.createTextField({
	value:'rounded border',
	height:35,
	top:10,
	left:10,
	right:60,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});


var tf2 = Ti.UI.createTextField({
	value:'bezel border',
	height:35,
	top:55,
	left:10,
	right:60,
	font:{fontSize:25},
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_BEZEL
});


var tf3 = Ti.UI.createTextField({
	value:'line border',
	height:35,
	top:100,
	left:10,
	right:60,
	font:{fontSize:15},
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_LINE
});


var tf4 = Ti.UI.createTextField({
	value:'no border',
	height:35,
	top:145,
	left:10,
	right:60,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE
});


var tf5 = Ti.UI.createTextField({
	hintText:'custom background image',
	height:32,
	top:190,
	backgroundImage:'../images/inputfield.png',
	paddingLeft:10,
	left:10,
	right:60,
	font:{fontSize:13},
	color:'#777',
	clearOnEdit:true
});

// add iphone specific tests
if (Ti.Platform.name == 'iPhone OS')
{
	scrolly.add(tf1);
	scrolly.add(tf2);
	scrolly.add(tf3);
	scrolly.add(tf4);
}

scrolly.add(tf5);