(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/statusbar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "statusbar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var b1 = Ti.UI.createButton({
	title:'Hide/Show',
	width:200,
	height:40,
	top:10
});
var hidden = false;
b1.addEventListener('click', function()
{
	if (!hidden)
	{
		Ti.UI.iPhone.hideStatusBar();
		hidden=true;
	}
	else
	{
		Ti.UI.iPhone.showStatusBar();
		hidden=false;
	}
});

win.add(b1);

var b2 = Ti.UI.createButton({
	title:'Toggle Style',
	width:200,
	height:40,
	top:60
});
var style=0;
b2.addEventListener('click', function()
{
	switch(style)
	{
		case 0:
			Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.OPAQUE_BLACK;
			style++;
			break;
		case 1:
			Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.GRAY;
			style++;
			break;
		case 2:
			Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.TRANSLUCENT_BLACK;
			style++;
			break;
		case 3:
			Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
			style=0;
			break;
	}
});
win.add(b2);