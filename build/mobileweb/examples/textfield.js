(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Events', hasChild:true, test:'../examples/textfield_events.js'},
	{title:'Keyboard', hasChild:true, test:'../examples/textfield_keyboards.js'},
	{title:'Border Style', hasChild:true, test:'../examples/textfield_borders.js'},
	// Android has all these also
	{title:'The Rest', hasChild:true, test:'../examples/textfield_therest.js'}
];

// add iphone specific tests
if (Ti.Platform.name == 'iPhone OS')
{
	data.push({title:'Toolbar', hasChild:true, test:'../examples/textfield_toolbar.js'});
	data.push({title:'Buttons on Textfields', hasChild:true, test:'../examples/textfield_buttons.js'});
	data.push({title:'Textfield in scrollview', hasChild:true, test:'../examples/textfield_scrollview.js'});
} else if (Ti.Platform.name == 'android') {
	data.push({title:'Soft Input Focus', hasChild:true, test:'../examples/textfield_softinputfocus.js'});
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