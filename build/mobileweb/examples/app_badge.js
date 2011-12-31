(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/app_badge.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "app_badge.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var b1 = Ti.UI.createButton({
	title:'Set App Badge',
	width:200,
	height:40,
	top:10
});
b1.addEventListener('click', function()
{
	Ti.UI.iPhone.appBadge = 20;
});

win.add(b1);

var b2 = Ti.UI.createButton({
	title:'Reset App Badge',
	width:200,
	height:40,
	top:60
});
b2.addEventListener('click', function()
{
	Ti.UI.iPhone.appBadge = null;
});

win.add(b2);