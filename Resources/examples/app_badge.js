setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/app_badge.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "app_badge.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;

var b1 = Titanium.UI.createButton({
	title:'Set App Badge',
	width:200,
	height:40,
	top:10
});
b1.addEventListener('click', function()
{
	Titanium.UI.iPhone.appBadge = 20;
});

win.add(b1);

var b2 = Titanium.UI.createButton({
	title:'Reset App Badge',
	width:200,
	height:40,
	top:60
});
b2.addEventListener('click', function()
{
	Titanium.UI.iPhone.appBadge = null;
});

win.add(b2);