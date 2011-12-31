(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_section_header.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_section_header.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//
//  This is a test that is meant to verify that a row object can have a header
//  and the table view has no table view header - the header should be displayed

var win = Ti.UI.currentWindow;

var inputData = [
	{title:'row 1', header:'Header 1'},
	{title:'row 2'},
	{title:'row 3'},
	{title:'row 4', header:'Header 2'},
	{title:'row 5'}
];
var tableView = Ti.UI.createTableView({
	data:inputData,
	style:Ti.UI.iPhone.TableViewStyle.GROUPED
});
win.add(tableView);