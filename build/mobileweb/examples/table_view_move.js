(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_move.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_move.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// create table view data object
var data = [
	{title:'Row 1', hasChild:true},
	{title:'Row 2', hasDetail:true},
	{title:'Row 3'},
	{title:'Row 4'},
	{title:'Row 5'},
	{title:'Row 6'},
	{title:'Row 7'}
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
	Ti.API.info("row - row index = "+row+", row section = "+row);
	Ti.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
});

// add move event listener
tableview.addEventListener('move',function(e)
{
	Ti.API.info("move - row="+e.row+", index="+e.index+", section="+e.section+", from = "+e.fromIndex);
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);

//
//  create edit/cancel buttons for nav bar
//
var edit = Ti.UI.createButton({
	title:'Move'
});

edit.addEventListener('click', function()
{
	win.setRightNavButton(cancel);
	tableview.moving = true;
});

var cancel = Ti.UI.createButton({
	title:'Cancel',
	style:Ti.UI.iPhone.SystemButtonStyle.DONE
});
cancel.addEventListener('click', function()
{
	win.setRightNavButton(edit);
	tableview.moving = false;
});

win.setRightNavButton(edit);