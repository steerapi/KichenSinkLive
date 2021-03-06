setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/yql_local_search.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "yql_local_search.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

// create table view
var tableview = Titanium.UI.createTableView({top: "60dp"});
Ti.UI.currentWindow.add(Ti.UI.createLabel({
	borderRadius: 5, backgroundColor: "blue",
	color: "yellow", left: "10dp", right: "10dp", top: "10dp", height: "40dp",
	textAlign: "center",
	font: {fontWeight: "bold", fontSize: 16},
	text: "Sushi near Appcelerator HQ"
}));

Ti.App.fireEvent("show_indicator");

var navActInd = null;
if (Titanium.Platform.name == 'iPhone OS') {
	navActInd = Titanium.UI.createActivityIndicator();
	navActInd.show();
	Titanium.UI.currentWindow.setRightNavButton(navActInd);
}

// add table view to the window
Titanium.UI.currentWindow.add(tableview);


function loadWebView(url, placeName) {
	var win = Ti.UI.createWindow({fullscreen:false, navBarHidden:false, title: placeName});
	var wv = Ti.UI.createWebView({
		url: url,
		left: 0, right: 0, top: 0, bottom: 0
	});
	win.add(wv);
	if (Ti.UI.currentTab) {
		Ti.UI.currentTab.open(win, {animated:true});
	} else {
		win.open({animated: true});
	}
}

Titanium.Yahoo.yql('select * from local.search where zip="94085" and query="sushi" limit 10',function(e)
{
	var data = e.data;
	if (data == null || !data.Result)
	{
		Titanium.UI.createAlertDialog({
			title: 'Error querying YQL',
			message: 'No data could be retrieved using YQL' }).show();
		Ti.App.fireEvent('hide_indicator');
		return;
	}
	var count = data.Result.length;
	var rows = [];
	for (var i = 0; i < count; i++) {
		var result = data.Result[i];
		var row = Ti.UI.createTableViewRow({height:60});
		row.yahooUrl = result.ClickUrl;
		row.place = result.Title;
		var title = Ti.UI.createLabel({
			left: 10,
			right: 10,
			textAlign: 'left',
			height: 50,
			text: result.Title + ", " + result.Address + ", " + result.City,
			font:{fontWeight:'bold',fontSize:18}
		});
		row.add(title);
		rows.push(row);
	}
	tableview.addEventListener("click", function(e) {
		loadWebView(e.row.yahooUrl, e.row.place);
	});
	tableview.setData(rows);
	if(navActInd){
		navActInd.hide();
	}
	Ti.App.fireEvent("hide_indicator");

});

