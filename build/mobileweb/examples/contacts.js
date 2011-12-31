(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/contacts.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "contacts.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Contacts picker', hasChild:true, test:'../examples/contacts_picker.js'},
	{title:'Display people', hasChild:true, test:'../examples/contacts_db.js'},
	{title:'Search By ID', hasChild:true, test:'../examples/contacts_searchById.js'}
];
if (Ti.Platform.osname !== 'android') {
	data.push({title:'Add contact',hasChild:true, test:'../examples/contacts_add.js'});
	data.push({title:'Remove contact',hasChild:true, test:'../examples/contacts_remove.js'});
}
	data.push({title:'Contact images',hasChild:true, test:'../examples/contacts_image.js'});
if (Ti.Platform.osname !== 'android') {
	data.push({title:'Groups',hasChild:true, test:'../examples/contacts_groups.js'});
}

// create table view
var tableview = Ti.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.test)
	{
		var win = Ti.UI.createWindow({
			url:e.rowData.test,
			title:e.rowData.title
		});
		Ti.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);

;