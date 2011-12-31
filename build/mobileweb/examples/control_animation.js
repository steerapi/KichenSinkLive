(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/control_animation.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "control_animation.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundColor = '#336699';

var button = Ti.UI.createButton({
	title:'Animate Me', 
	width:300,
	height:40,
	top:10
});

win.add(button);

button.addEventListener('click', function()
{
	var t = Ti.UI.iOS.create3DMatrix();
	t = t.rotate(200,0,1,1);
	t = t.scale(3);
	t = t.translate(20,50,170);
	t.m34 = 1.0/-2000;
	button.animate({transform:t, duration:1000, autoreverse:true});
});

;