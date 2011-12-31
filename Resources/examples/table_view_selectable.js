setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/table_view_selectable.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "table_view_selectable.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

// create table view data object
var data = [
	{title:'Row 1', hasChild:true, color:'red', selectedColor:'#fff'},
	{title:'Row 2', hasDetail:true, color:'green', selectedColor:'#fff'},
	{title:'Row 3', hasCheck:true, color:'blue', selectedColor:'#fff'},
	{title:'Row 4', color:'orange', selectedColor:'#fff'}
];

// create table view
var tableview = Titanium.UI.createTableView({
	data:data,
	allowsSelection:true
});

tableview.selectRow(3);
// add table view to the window
Titanium.UI.currentWindow.add(tableview);
