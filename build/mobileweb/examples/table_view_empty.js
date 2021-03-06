(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_empty.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_empty.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var tableView = Ti.UI.createTableView({top:110,backgroundColor:'yellow'});


var b1 = Ti.UI.createButton({
	height:40,
	width:200,
	title:'Append (row obj)',
	top:10
});
win.add(b1);
b1.addEventListener('click',function()
{
	tableView.appendRow({title:'Foo'},{animationStyle:Ti.UI.iPhone.RowAnimationStyle.LEFT} );

	//NOTE: since we're appending 2 different row layouts, we need to give one of them
	//a table className otherwise the tableview will assume they're the same layout and
	//you'll get warnings and bad performance on lots of rows - this shows you how to do that
	var row = Ti.UI.createTableViewRow({height:50,className:'row'});
	var label = Ti.UI.createLabel({text:'row 1', color:'#111', width:'auto', height:'auto'});
	row.add(label);
	tableView.appendRow(row,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.LEFT});
});

var b2 = Ti.UI.createButton({
	height:40,
	width:200,
	title:'Set',
	top:60
});
win.add(b2);
b2.addEventListener('click',function()
{
	var data = [
		{title:'Row 1'},
		{title:'Row 2'},
		{title:'Row 3'},
		{title:'Row 4'}
	];
	tableView.setData(data,{animationStyle:Ti.UI.iPhone.RowAnimationStyle.LEFT});

});
win.add(tableView);

;