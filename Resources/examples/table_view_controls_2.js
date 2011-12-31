(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/table_view_controls_2.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "table_view_controls_2.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
var clickLabel = Ti.UI.createLabel({
	top:0,
	height:'auto',
	textAlign:'center',
	font:{fontSize:13},
	color:'#777'
});
win.add(clickLabel);

function addRow()
{
	var row = Ti.UI.createTableViewRow({height:50});
	var sw = Ti.UI.createSwitch({
		right:10,
		value:false
	});

	row.add(sw);

	sw.addEventListener('change', function(e)
	{
		Ti.API.info('parent for switch ' + e.source.parent);
		clickLabel.text = 'Switch changed to ' + e.value + ' at ' + new Date();
	});

	var button = Ti.UI.createButton({
		style:Titanium.UI.iPhone.SystemButton.DISCLOSURE,
		left:10
	});

	row.add(button);

	button.addEventListener('click', function(e)
	{
		clickLabel.text = 'Button clicked at ' + new Date();
	});
	row.className = 'control';
	return row;
}

// create table view data object
var data = [];

var row = Ti.UI.createTableViewRow({height:50});
var l = Ti.UI.createLabel({
	text:'Append Row',
	color:'#999',
	textAlign:'center'

});
row.add(l);
row.className = 'header';
row.addEventListener('click', function()
{
	tableView.appendRow(addRow());
});
data[0] = row;

for (var x=1;x<3;x++)
{
	data[x] = addRow();
}

var tableView = Ti.UI.createTableView({
	data:data,
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
	top:50
});
tableView.addEventListener('click', function(e)
{
	clickLabel.text = 'row clicked at ' + new Date()+', source='+e.source;
});
win.add(tableView);