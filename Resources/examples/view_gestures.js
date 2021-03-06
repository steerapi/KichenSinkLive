setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/view_gestures.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "view_gestures.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;
win.backgroundColor = 'blue';
win.name = "window";

var view = Ti.UI.createView({
  backgroundColor:"red"
});

win.add(view);

function pinchHandler(e) {
  Ti.API.info('pinch:' + JSON.stringify(e));
}

function longpressHandler(e) {
  Ti.API.info('longpress:' + JSON.stringify(e));
}

view.addEventListener('pinch', pinchHandler);
view.addEventListener('longpress', longpressHandler);

var b1 = Titanium.UI.createButton({
	title:'Remove Pinch',
	height:40,
	width:200,
	top:0
});
win.add(b1);

function buttonHandler(e) {
	view.removeEventListener('pinch', pinchHandler);
}

b1.addEventListener('click', buttonHandler);

//////////

// create table view data object
var data = [];

data[0] = Ti.UI.createTableViewRow({hasChild:true,title:'No cell selection',selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE});
data[1] = Ti.UI.createTableViewRow({hasDetail:true,title:'Blue cell selection',selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.BLUE});
data[2] = Ti.UI.createTableViewRow({hasCheck:true,title:'Gray cell selection',selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY});
data[3] = Ti.UI.createTableViewRow({title:'Default cell selection'});

// create table view
var tableview = Titanium.UI.createTableView({
	data:data,
	height:160,
	width:200,
	top:50
});

// create table view event listener
tableview.addEventListener('click', function(e) {
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);

//////////

var webview = Ti.UI.createWebView({
	url:'local_webview_pinchzoom.html',
	height:160,
	width:200,
	top:220
});

webview.scalesPageToFit = true;
win.add(webview);
