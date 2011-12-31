(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_delete.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_delete.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var data = [];
// create the rest of the rows
for (var c=0;c<50;c++)
{
	var row = Ti.UI.createTableViewRow();
	row.height  =100;
	row.myid = c;
	var user = Ti.UI.createLabel({
		color:'#576996',
		font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
		left:20,
		top:2,
		height:30,
		width:200,
		text:'Fred Smith'
	});
	user.rowNum = c;
	row.add(user);

	var comment = Ti.UI.createLabel({
		color:'#222',
		font:{fontSize:16,fontWeight:'normal', fontFamily:'Arial'},
		left:20,
		top:21,
		height:50,
		width:200,
		text:'Got some fresh fruit, conducted some business, took a nap'
	});
	comment.rowNum = c;
	row.add(comment);


	data.push(row);
}
var tableView = Ti.UI.createTableView({
	data:data,
	deleteButtonTitle:'Foo'
});


// add delete event listener
tableView.addEventListener('delete',function(e)
{
	Ti.API.info("row myid = " + e.row.myid + "deleted - row="+e.row+", index="+e.index+", section="+e.section);
});

win.add(tableView);

//
//  create edit/cancel buttons for nav bar
//
var edit = Ti.UI.createButton({
	title:'Edit'
});

edit.addEventListener('click', function()
{
	win.setRightNavButton(cancel);
	tableView.editing = true;
});

var cancel = Ti.UI.createButton({
	title:'Cancel',
	style:Ti.UI.iPhone.SystemButtonStyle.DONE
});
cancel.addEventListener('click', function()
{
	win.setRightNavButton(edit);
	tableView.editing = false;
});

win.setRightNavButton(edit);


;