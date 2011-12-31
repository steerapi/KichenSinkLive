(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_textfield.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_textfield.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

function addRow(addTextArea)
{
	var row = Ti.UI.createTableViewRow({height:50});
	var tf1 = null;
	if (addTextArea)
	{
		tf1 = Ti.UI.createTextArea({
			color:'#336699',
			width:250
		});

	}
	else
	{
		tf1 = Ti.UI.createTextField({
			color:'#336699',
			height:35,
			top:10,
			left:10,
			width:250,
			hintText:'hint',
			borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE
		});

	}
	row.add(tf1);
	row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	row.className = 'control';
	return row;
}

// create table view data object
var data = [];

for (var x=0;x<10;x++)
{
	if (x==9){
		data[x] = addRow(true);
	} else {
		data[x] = addRow();
	}

}

var tableView = Ti.UI.createTableView({
	data:data,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});
win.addEventListener('focus', function()
{
	Ti.API.info('window focus fired');
});
win.add(tableView);