(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/animation.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "animation.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//
//	animation properties
//	---------------------
//	zIndex, left, right, top, bottom, width, height
//	duration, center, backgroundColor, opacity, opaque,
//	visible, curve, repeat, autoreverse, delay, transform, transition
//

// create table view data object
var data = [
	{title:'Basic', hasChild:true, test:'../examples/basic_animation.js'},
	{title:'Transitions', hasChild:true, test:'../examples/transitions.js'},
	{title:'Windows', hasChild:true, test:'../examples/window_animation.js'},
	{title:'Views', hasChild:true, test:'../examples/view_animation.js'},
	{title:'Controls', hasChild:true, test:'../examples/control_animation.js'},
	{title:'2D Transform', hasChild:true, test:'../examples/2d_transform.js'},
	{title:'3D Transform', hasChild:true, test:'../examples/3d_transform.js'},
	{title:'Anchor Point', hasChild:true, test:'../examples/anchor_point.js'},
	{title:'Image Scaling', hasChild:true, test:'../examples/image_scaling.js'},
	{title:'Animation Points', hasChild:true, test:'../examples/animation_points.js'}

];

// create table view
var tableview = Ti.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.test)
	{
		var win = Ti.UI.createWindow({
			url:e.rowData.test,
			title:e.rowData.title,
			backgroundColor:'#fff'
		});
		Ti.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);