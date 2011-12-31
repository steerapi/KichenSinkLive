(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/animation_points.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "animation_points.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;

var circle = Titanium.UI.createView({
	height:100,
	width:100,
	borderRadius:50,
	backgroundColor:'#336699',
	top:0,
	left:0
});

win.add(circle);

var a = Ti.UI.createAnimation();
a.top = 400;
a.left = 300;
a.duration = 10000;

var l = Ti.UI.createLabel({
	text:'N/A',
	bottom:10,
	height:20,
	color:'#999',
	textAlign:'center'
});

win.add(l);

var b = Ti.UI.createButton({
	title:'Stop Animation',
	height:30,
	width:200
});
win.add(b);
b.addEventListener('click', function()
{
	circle.animate({center:{x:circle.animatedCenter.x,y:circle.animatedCenter.y }});
});
circle.animate(a, function()
{
	clearInterval(interval);
});

var interval = setInterval(function()
{
	l.text = 'center x: ' + circle.animatedCenter.x + ' y: ' + circle.animatedCenter.y;
},1000);

win.addEventListener('close', function() {
	clearInterval(interval);
});