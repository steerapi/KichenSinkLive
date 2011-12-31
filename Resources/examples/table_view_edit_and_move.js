setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/table_view_edit_and_move.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "table_view_edit_and_move.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;

// create table view data object
var data = [
	{title:'Row 1', hasChild:true},
	{title:'Row 2', hasDetail:true},
	{title:'Delete only', moveable:false},
	{title:'Move only', editable:false},
	{title:'Neither', moveable:false, editable:false},
	{title:'Row 6'},
	{title:'Row 7'}
];

// create table view
var tableview = Titanium.UI.createTableView({
	data:data, editable:true, moveable:true
});


// add move event listener
tableview.addEventListener('move',function(e)
{
	Titanium.API.info("move - row="+e.row+", index="+e.index+", section="+e.section+", from = "+e.fromIndex);
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);

//
//  create edit/cancel buttons for nav bar
//
var edit = Titanium.UI.createButton({
	title:'Edit'
});

edit.addEventListener('click', function()
{
	win.setRightNavButton(cancel);
	tableview.editing = true;
});

var cancel = Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
cancel.addEventListener('click', function()
{
	win.setRightNavButton(edit);
	tableview.editing = false;
});

win.setRightNavButton(edit);