(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/slider.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "slider.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create slider view data object
var data = [
	{title:'Basic', hasChild:true, test:'../examples/slider_basic.js'},
	{title:'Change Min/Max', hasChild:true, test:'../examples/slider_min_max.js'}
];

// add iphone specific tests
if (Titanium.Platform.name == 'iPhone OS')
{
} else if (Titanium.Platform.name == 'android') {
	data.push({title:'Min/Max Range', hasChild:true, test:'../examples/slider_range.js'});
}

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
			title:e.rowData.title
		});
		Titanium.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
