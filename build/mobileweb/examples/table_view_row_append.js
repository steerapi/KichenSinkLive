(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_row_append.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_row_append.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Row 1', hasChild:true},
	{title:'Row 2', hasDetail:true},
	{title:'Append Row with Header'},
	{title:'Append Row & height=100'}


];

// create table view
var tableview = Ti.UI.createTableView({
	data:data
});


var newRowCount = 1;
var newSectionCount = 1;
// create table view event listener
tableview.addEventListener('click', function(e)
{
	Ti.API.info('clicked received for row ' + e.index);
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	row.height = 100;
	var rowdata = e.rowData;
	if (index == 2)
	{
		// var row = Ti.UI.createTableViewRow({header:'New Header'});
		// var l = Ti.UI.createLabel({
		//     text:' I am a new row',
		//     height:30,
		//     width:200
		// });
		// row.add(l);
		var data = {title:'New Row ' + newRowCount, header:'New Header '+newSectionCount};

		tableview.appendRow(data);
		newSectionCount++;
		newRowCount++;
	}
	else if (index == 3)
	{
		var data = Ti.UI.createTableViewRow({title:'New Row ' + newRowCount});
		if (newRowCount == 1)
		{
			tableview.appendRow(data);
		}
		else
		{
			tableview.appendRow(data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.LEFT});
		}
		newRowCount++;
	}
	else
	{
		Ti.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
	}

});
tableview.addEventListener('longclick', function(e){
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	var msg = 'LONGCLICK row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata;
	Ti.UI.createAlertDialog({title:'Table View',message:msg}).show();
});


// add table view to the window
Ti.UI.currentWindow.add(tableview);