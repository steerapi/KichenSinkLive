(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_row_update.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_row_update.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// create table view data
var data = [
	{title:'Change Me (No Anim)', header:'Section 0'},
	{title:'Change Me', name:'row2'},
	{title:'Change Me'},
	{title:'Change Me'},
	{title:'Click to go title (above)'},
	{title:'Row7'},
	{title:'Row8',header:'Section 1'},
	{title:'Row9'},
	{title:'Row10'},
	{title:'Row11'},
	{title:'Row12'},
	{title:'Row13'},
	{title:'Row14'},
	{title:'Row15'}
];

//
// Create table view
//
var tableView = Ti.UI.createTableView({data:data});
tableView.addEventListener('click',function(e)
{
	switch(e.index)
	{
		case 0:
			var data = {title:'New Row 1 Title', header:'New Section Header'};
			tableView.updateRow(0,data);				
			break;
		case 1:
			var row = tableView.getIndexByName('row2');
			data = {title:'New Row2',name:'row2'};
			tableView.updateRow(row,data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.RIGHT});

			break;
		case 2:
			data = {title:'New Row3'};
			tableView.updateRow(2,data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.LEFT});
			break;
		case 3:
			data = {title:'New Row4'};
			tableView.updateRow(3,data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.DOWN});
			break;
		case 4:
			data = {title:'I am a title'};
			tableView.updateRow(4,data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.DOWN});
			break;
		
	}

	
});

win.add(tableView);