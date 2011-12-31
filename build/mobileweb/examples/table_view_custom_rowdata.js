(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_custom_rowdata.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_custom_rowdata.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Row 1', hasChild:true, foo:'123'},
	{title:'Row 2', hasDetail:true, foo:'456'},
	{title:'Row 3', foo:'789'},
	{title:'Row 4', foo:'101112'}
	

];

// create table view
var tableview = Ti.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	
	// custom property
	var prop = e.rowData.foo;
	
	Ti.UI.createAlertDialog({title:'Table View',message:'custom value ' + prop}).show();
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);