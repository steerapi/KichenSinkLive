(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_row_delete.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_row_delete.js",
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
	{title:'Row 3 (no animation)', name:'foo'},
	{title:'Row 4 (no animation)', name:'bar'},
	{title:'Row 5'}
];

//
// set right nav button
//
var button = Ti.UI.createButton({
	title:'Delete Row',
	style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
});

var tableViewOptions = {data: data};
if (Ti.Platform.name == 'iPhone OS') {
	win.rightNavButton = button;
} else {
	button.top = 5;
	button.width = 300;
	button.height = 30;
	tableViewOptions.top = 45;
	win.add(button);
}

// create table view
var tableview = Ti.UI.createTableView(tableViewOptions);

function showClickEventInfo(e, islongclick) {
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	var msg = 'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata;
	if (islongclick) {
		msg = "LONGCLICK " + msg;
	}
	Ti.UI.createAlertDialog({title:'Table View',message:msg}).show();
}
// create table view event listener
tableview.addEventListener('click', function(e)
{
	showClickEventInfo(e);
});
tableview.addEventListener('longclick', function(e)
{
	showClickEventInfo(e, true);
});
// add table view to the window
win.add(tableview);

button.addEventListener('click', function()
{
	var index = tableview.data.length-1;
	Ti.API.info("deleting row "+index);
	
	try {
		tableview.deleteRow(index,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.UP});
	} catch (E) {
		Ti.UI.createNotification({ message: E.message }).show();
	}
});