(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/image_views.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "image_views.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Basic', hasChild:true, test:'../examples/image_view_basic.js'},
	{title:'Animated', hasChild:true, test:'../examples/image_view_animated.js'},
	{title:'Image File', hasChild:true, test:'../examples/image_view_file.js'},
	{title:'Remote Image', hasChild:true, test:'../examples/image_view_remote.js'},
	{title:'Image Scaling', hasChild:true, test:'../examples/image_view_scaling.js'},
	{title:'Image View Positioning', hasChild:true, test:'../examples/image_view_positioning.js'},
	{title:'Image View Encoding', hasChild:true, test:'../examples/image_view_encoding.js'}

];

// add iphone specific tests
if (Ti.Platform.name == 'iPhone OS')
{
	data.push({title:'Image Blob', hasChild:true, test:'../examples/image_view_blob.js'});
	data.push({title:'Image Masking', hasChild:true, test:'../examples/image_mask.js'});
	data.push({title:'Image Toolbar', hasChild:true, test:'../examples/image_view_toolbar.js'});
}

data.push({title:'Image Rapid Update', hasChild:true, test:'../examples/image_view_updateimages.js'});
if (Ti.Platform.name == 'android') {
	data.push({title:'Android drawable resource', hasChild:true, test:'image_view_resource.js'});
}

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
			title:e.rowData.title
		});
		Ti.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);