(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/scroll_views.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "scroll_views.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Basic', hasChild:true, test:'../examples/scroll_views_basic.js'},
	{title:'Scrolling Tabs', hasChild:true, test:'../examples/scroll_views_tabs.js'},
	{title:'Scrollable View', hasChild:true, test:'../examples/scroll_views_scrollable.js'},
	{title:'Many on a Screen', hasChild:true, test:'../examples/scroll_views_many.js'},
	{title:'Scroll Views TextArea', hasChild:true, test:'../examples/scroll_views_textareas.js'}

];

// add iphone specific tests
if (Ti.Platform.name == 'iPhone OS')
{
	data.push({title:'Scrollable View w/o Clipping', hasChild:true, test:'../examples/scroll_views_without_clipping.js', barColor:'#111', bgImage:'../images/scrollable_view/bg.png'});
	data.push({title:'Scrolling Zoom+Pinch', hasChild:true, test:'../examples/scroll_views_scaling.js'});
    data.push({title:'Scrolling Drag Start&End', hasChild:true, test:'../examples/scroll_views_dragging.js'});
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

		if (e.rowData.barColor)
		{
			win.barColor = e.rowData.barColor;
		}
		if (e.rowData.bgImage)
		{
			win.backgroundImage = e.rowData.bgImage;
		}
		Ti.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);