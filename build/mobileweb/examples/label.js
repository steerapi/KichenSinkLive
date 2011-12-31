(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/label.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "label.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create label view data object
var data = [
	{title:'Basic', hasChild:true, test:'../examples/label_basic.js'}
];

// add android specific tests
if (Ti.Platform.name == 'android')
{
	data.push({title:'Auto Link', hasChild:true, test:'../examples/label_linkify.js'});
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