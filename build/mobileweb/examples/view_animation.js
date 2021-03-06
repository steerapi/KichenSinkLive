(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/view_animation.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "view_animation.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var stopped = false;
var nextAnimation = null;
//
// create tip (window + view + label)
//
var winContainer = Ti.UI.createWindow({
	height:30,
	width:200,
	bottom:100
});

var view = Ti.UI.createView({
	backgroundColor:'#000',
	height:30,
	width:200,
	opacity:0.7,
	borderRadius:10
});
winContainer.add(view);

var label = Ti.UI.createLabel({
	text:'Hovering tip...',
	color:'#fff',
	textAlign:'center',
	width:'auto',
	height:'auto'
});
winContainer.add(label);

//
// button to start animation
//
var button = Ti.UI.createButton({
	title:'Start Animation',
	width:200,
	height:40,
	top:20
});
button.addEventListener('click', function()
{
	stopped = false;
	
	var a1 = Ti.UI.createAnimation();
	a1.bottom = 120;
	a1.duration = 800;

	var a2 = Ti.UI.createAnimation();
	a2.bottom = 80;
	a2.duration = 800;
	
	if (nextAnimation == null) {
		nextAnimation = a1;
	}
	winContainer.animate(nextAnimation);
	
	a1.addEventListener('complete', function()
	{
		if (!stopped)
		{
			winContainer.animate(nextAnimation);
			nextAnimation = a2;
		}
	});

	a2.addEventListener('complete', function()
	{
		if (!stopped)
		{
			winContainer.animate(nextAnimation);
			nextAnimation = a1;
		}
	});
	

});
win.add(button);

//
// button to stop animation
//
var button2 = Ti.UI.createButton({
	title:'Stop Animation',
	width:200,
	height:40,
	top:70
});

button2.addEventListener('click', function()
{
	if (!stopped) 
	{
		stopped = true;
	}
});
win.add(button2);

// open container 
winContainer.open();

// add close listenr to close container
win.addEventListener('close', function()
{
	winContainer.close();
});