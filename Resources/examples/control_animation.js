(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/control_animation.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "control_animation.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;
win.backgroundColor = '#336699';

var button = Titanium.UI.createButton({
	title:'Animate Me', 
	width:300,
	height:40,
	top:10
});

win.add(button);

button.addEventListener('click', function()
{
	var t = Titanium.UI.iOS.create3DMatrix();
	t = t.rotate(200,0,1,1);
	t = t.scale(3);
	t = t.translate(20,50,170);
	t.m34 = 1.0/-2000;
	button.animate({transform:t, duration:1000, autoreverse:true});
});

