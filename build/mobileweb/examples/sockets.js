(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/sockets.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "sockets.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Connecting socket', hasChild:true, test:'../examples/socket_connect.js'},
	{title:'Listening socket', hasChild:true, test:'../examples/socket_listener.js'},
	{title:'Server and client example', hasChild:true, test:'../examples/socket_server_client.js'}
];

if (Ti.Platform.name == 'iPhone OS')
{
	data.push({title:'iOS TCP Sockets [deprecated]', hasChild:true, test:'../examples/ios_sockets.js'});
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