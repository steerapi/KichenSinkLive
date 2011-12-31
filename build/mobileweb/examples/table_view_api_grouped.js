(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_api_grouped.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_api_grouped.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [];

for (var c=0;c<4;c++)
{
	data[c] = Ti.UI.createTableViewSection({headerTitle:'Group '+(c+1)});
	for (var x=0;x<10;x++)
	{
		data[c].add(Ti.UI.createTableViewRow({title:'Group '+(c+1)+', Row '+(x+1)}));
	}
}

// create table view
var tableview = Ti.UI.createTableView({
	data:data,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	if (section.headerTitle.indexOf('clicked')==-1)
	{
		section.headerTitle = section.headerTitle + ' (clicked)';
	}
	Ti.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);