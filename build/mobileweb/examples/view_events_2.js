(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/view_events_2.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "view_events_2.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var l = Ti.UI.createLabel({
	text:'',
	top:10,
	width:300,
	height:20,
	textAlign:'center'
});

win.add(l);

var l2 = Ti.UI.createLabel({
	text:'',
	top:30,
	height:20,
	textAlign:'center',
	width:300
});
win.add(l2);

var l3 = Ti.UI.createLabel({
	text:'',
	top:50,
	height:20,
	textAlign:'center',
	width:300
});
win.add(l3);

var l4 = Ti.UI.createLabel({
	text:'',
	top:70,
	height:20,
	textAlign:'center',
	width:300
});
win.add(l4);

var box1 = Ti.UI.createView({
    height:50,
    width:50,
    backgroundColor:'#f00'
});
var box2 = Ti.UI.createView({
	height:100,
	width:100,
	backgroundColor:'#0f0'
});
box2.add(box1);
win.add(box2);
win.addEventListener('touchstart', function(e)
{
	l.text = "touchstart " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")";
    Ti.API.log("touchstart " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")");
});

win.addEventListener('singletap', function(e)
{
	l2.text = "singletap " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")";
    Ti.API.log("singletap " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")");
});

win.addEventListener('touchmove', function(e)
{
	l3.text = "touchmove " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")";
    Ti.API.log("touchmove " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")");
});

win.addEventListener('swipe', function(e)
{
	l4.text = "swipe ("+e.direction+") " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")";
    Ti.API.log("swipe ("+e.direction+") " + e.x + ", " + e.y + " ("+e.globalPoint.x+","+e.globalPoint.y+")");
});


;