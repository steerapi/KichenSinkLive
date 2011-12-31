(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/coverflow_view.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "coverflow_view.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var images = [];
for (var c=0;c<30;c++)
{
	images[c]='../images/imageview/'+c+'.jpg';
}

// create coverflow view with images
var view = Ti.UI.iOS.createCoverFlowView({
	images:images,
	backgroundColor:'#000'
});

// click listener - when image is clicked
view.addEventListener('click',function(e)
{
	Ti.API.info("image clicked: "+e.index+', selected is '+view.selected);	
});

// change listener when active image changes
view.addEventListener('change',function(e)
{
	Ti.API.info("image changed: "+e.index+', selected is '+view.selected);	
});
win.add(view);

// change button to dynamically change the image
var change = Ti.UI.createButton({
	title:'Change Image',
	style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
});
change.addEventListener('click',function()
{
	Ti.API.info("selected is = "+view.selected);
	view.setImage(view.selected,'../images/imageview/28.jpg');
});

// move scroll view left
var left = Ti.UI.createButton({
	image:'../images/icon_arrow_left.png'
});
left.addEventListener('click', function(e)
{
	var i = view.selected - 1;
	if (i < 0) 
	{
		i = 0;
	}
	view.selected = i;
});

// move scroll view right
var right = Ti.UI.createButton({
	image:'../images/icon_arrow_right.png'
});
right.addEventListener('click', function(e)
{
	var i = view.selected + 1;
	if (i >= images.length) 
	{
		i = images.length - 1;
	}
	view.selected = i;
});
var flexSpace = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
win.setToolbar([flexSpace,left,change,right,flexSpace]);