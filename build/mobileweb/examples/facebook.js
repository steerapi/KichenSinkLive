(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/facebook.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "facebook.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------


//create table view data object
var data = [
	{title:'Login/Logout', hasChild:true, test:'../examples/facebook_login_logout.js'},
	{title:'Query', hasChild:true, test:'../examples/facebook_query.js'},
	{title:'Properties', hasChild:true, test:'../examples/facebook_properties.js'},
	{title:'Publish Stream', hasChild:true, test:'../examples/facebook_publish_stream.js'},
	{title:'Photos', hasChild:true, test:'../examples/facebook_photos.js'}

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
			title:e.rowData.title
		});
		Ti.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);



;