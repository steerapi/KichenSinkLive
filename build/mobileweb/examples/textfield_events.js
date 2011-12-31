(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield_events.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield_events.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// initialize to all modes
win.orientationModes = [
	Ti.UI.PORTRAIT,
	Ti.UI.LANDSCAPE_LEFT,
	Ti.UI.LANDSCAPE_RIGHT
]; 

var scrolly = Ti.UI.createScrollView({contentHeight:'auto'});
win.add(scrolly);

var tf1 = Ti.UI.createTextField({
	color:'#336699',
	height:35,
	top:10,
	left:10,
	width:250,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var l = Ti.UI.createLabel({
	top:50,
	left:10,
	width:300,
	height:'auto',
	color:'#777',
	font:{fontSize:13},
	text:'do something like click a button...'
});
scrolly.add(l);

//
// TEXT FIELD EVENTS (return, focus, blur, change)
//
tf1.addEventListener('return',function(e)
{
	l.text = 'return received, val = ' + e.value;
	tf1.blur();
});
tf1.addEventListener('focus',function(e)
{
	l.text = 'focus received, val = ' + e.value;
});
tf1.addEventListener('blur',function(e)
{
	l.text = 'blur received, val = ' + e.value;	
});
tf1.addEventListener('change', function(e)
{
	l.text = 'change received, event val = ' + e.value + '\nfield val = ' + tf1.value;	
});

scrolly.add(tf1);



//
// FOCUS
//
var focusLabel = Ti.UI.createButton({
	top:100,
	height:40,
	width:200,
	title:'Focus'
});
scrolly.add(focusLabel);
focusLabel.addEventListener('click', function()
{
	tf1.focus();
});

//
// BLUR
//
var blurLabel = Ti.UI.createButton({
	top:150,
	height:40,
	width:200,
	title:'Blur'
});
scrolly.add(blurLabel);
blurLabel.addEventListener('click', function()
{
	tf1.blur();
});

//
// HIDE/SHOW
//
var showHide = Ti.UI.createButton({
	top:200,
	height:40,
	width:200,
	title:'Hide/Show'
});
scrolly.add(showHide);
var visible = true;
showHide.addEventListener('click', function()
{
	if (!visible)
	{
		tf1.show();
		visible = true;
	}
	else
	{
		tf1.hide();
		visible = false;
	}
});

var instructions = Ti.UI.createLabel({
	text:'Rotate device while keyboard is up',
	bottom:10,
	height:30,
	color:'#777'
});
scrolly.add(instructions);

;