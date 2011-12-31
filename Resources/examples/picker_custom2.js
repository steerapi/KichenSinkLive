(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/picker_custom2.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "picker_custom2.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;
win.backgroundColor = 'black';

var picker = Ti.UI.createPicker();

function addRow(x)
{
	var row = Ti.UI.createPickerRow();
	var img = Ti.UI.createImageView({image:'../images/imageview/'+x+'.jpg',width:40,height:40});
	row.add(img);
	picker.add(row);
}

for(var c=0;c<=10;c++)
{
	addRow(c);
}

// turn on the selection indicator (off by default)
picker.selectionIndicator = true;

win.add(picker);

var label = Ti.UI.createLabel({
	text:'Make a move',
	top:10,
	width:'auto',
	height:'auto',
	textAlign:'center',
	color:'white'
});
win.add(label);


picker.addEventListener('change',function(e)
{
	Ti.API.info("You selected row: "+e.row+", column: "+e.column+", custom_item: "+e.row.custom_item);
	label.text = "row index: "+e.rowIndex+", column index: "+e.columnIndex;
});
