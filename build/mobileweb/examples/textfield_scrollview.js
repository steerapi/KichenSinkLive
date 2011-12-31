(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield_scrollview.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield_scrollview.js",
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

var scrollview = Ti.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:false
});

var tf1 = Ti.UI.createTextField({
	width:200,
	height:100,
	top:0,
	value:'top',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollview.add(tf1);

var tf2 = Ti.UI.createTextField({
	width:200,
	height:100,
	top:500,
	value:'middle',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollview.add(tf2);

var tf3 = Ti.UI.createTextField({
	width:200,
	height:100,
	top:900,
	value:'bottom',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollview.add(tf3);

win.add(scrollview);