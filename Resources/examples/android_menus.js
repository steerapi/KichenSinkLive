(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/android_menus.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "android_menus.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//create table view data object
var data = [];

data.push({title:'Basic Menu', hasChild:true, test:'../examples/android_menu_1.js'});
data.push({title:'Menu Handlers (Window Options)', hasChild:true, test:'../examples/android_menu_2.js'});
data.push({title:'Menu Handlers (Activity Property)', hasChild:true, test:'../examples/android_menu_3.js'});

// create table view
var tableview = Titanium.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.test)
	{
		var win = Titanium.UI.createWindow({
			url:e.rowData.test,
			title:e.rowData.wintitle || e.rowData.title
		});
		Titanium.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
