(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/vertical_layout.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "vertical_layout.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//create table view data object
var data = [
	{title:'Basic', hasChild:true, test:'../examples/vertical_layout_basic.js'},
	 {title:'Table View', hasChild:true, test:'../examples/vertical_layout_table_view.js'}
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