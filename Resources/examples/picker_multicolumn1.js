setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/picker_multicolumn1.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "picker_multicolumn1.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;
win.backgroundColor = 'black';

var picker = Ti.UI.createPicker();

var column1 = Ti.UI.createPickerColumn({opacity:0});
column1.addRow(Ti.UI.createPickerRow({title:'Bananas',custom_item:'b'}));
column1.addRow(Ti.UI.createPickerRow({title:'Strawberries',custom_item:'s', selected:true}));
column1.addRow(Ti.UI.createPickerRow({title:'Mangos',custom_item:'m'}));
column1.addRow(Ti.UI.createPickerRow({title:'Grapes',custom_item:'g'}));

var column2 = Ti.UI.createPickerColumn();
column2.addRow(Ti.UI.createPickerRow({title:'red'}));
column2.addRow(Ti.UI.createPickerRow({title:'green'}));
column2.addRow(Ti.UI.createPickerRow({title:'blue'}));
column2.addRow(Ti.UI.createPickerRow({title:'orange'}));

// 2 columns as an array
picker.add([column1,column2]);


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

