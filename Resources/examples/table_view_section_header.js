setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/table_view_section_header.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "table_view_section_header.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

//
//  This is a test that is meant to verify that a row object can have a header
//  and the table view has no table view header - the header should be displayed

var win = Titanium.UI.currentWindow;

var inputData = [
	{title:'row 1', header:'Header 1'},
	{title:'row 2'},
	{title:'row 3'},
	{title:'row 4', header:'Header 2'},
	{title:'row 5'}
];
var tableView = Titanium.UI.createTableView({
	data:inputData,
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED
});
win.add(tableView);
