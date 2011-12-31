(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/scroll_views_without_clipping.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "scroll_views_without_clipping.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//
// SETUP WINDOW STYLES
//
Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.OPAQUE_BLACK;
var win = Ti.UI.currentWindow;
win.title = 'All Friends';

var cover = Ti.UI.createView({
	backgroundImage:'../images/scrollable_view/bg.png',
	zIndex:5
});
win.add(cover);
win.addEventListener('open',function(E){
cover.animate({opacity:0,duration:2000});
});



var data = [];
for (var i=0;i<20;i++)
{
	var row = Ti.UI.createTableViewRow();
	row.height = 69;
	row.backgroundImage = '../images/scrollable_view/table_view_row.png';

	var label = Ti.UI.createLabel({
		color:'#fff',
		font:{fontSize:14},
		text:'Hello World',
		top:5,
		left:10
	});

	row.add(label);
	data.push(row);
}
var t = Ti.UI.create2DMatrix().scale(0.75);
var tableview = Ti.UI.createTableView({
	data:data,
	backgroundColor:'transparent',
	separatorStyle:0,
	transform:t,
	top:-7,
	visible:true
});

var data2 = [];
for (var i=0;i<20;i++)
{
	var row = Ti.UI.createTableViewRow();
	row.height = 69;
	row.backgroundImage = '../images/scrollable_view/table_view_row.png';

	var label = Ti.UI.createLabel({
		color:'#fff',
		font:{fontSize:14},
		text:'Hello World',
		top:5,
		left:10
	});

	row.add(label);
	data2.push(row);
}
var t2 = Ti.UI.create2DMatrix().scale(0.75);
var tableview2 = Ti.UI.createTableView({
	data:data2,
	backgroundColor:'transparent',
	separatorStyle:0,
	transform:t2,
	visible:true
});

var data3 = [];
for (var i=0;i<20;i++)
{
	var row = Ti.UI.createTableViewRow();
	row.height = 69;
	row.backgroundImage = '../images/scrollable_view/table_view_row.png';

	var label = Ti.UI.createLabel({
		color:'#fff',
		font:{fontSize:14},
		text:'Hello World',
		top:5,
		left:10
	});
	row.add(label);
	data3.push(row);
}
var t3 = Ti.UI.create2DMatrix().scale(0.75);

var tableview3 = Ti.UI.createTableView({
	data:data3,
	backgroundColor:'transparent',
	separatorStyle:0,
	transform:t3,
	visible:true

});

win.add(tableview);
win.add(tableview2);
win.add(tableview3);

var image1 = tableview.toImage();
var image2 = tableview2.toImage();
var image3 = tableview3.toImage();

var iv1 = Ti.UI.createImageView({image:image1,height:290, width:240});
var iv2 = Ti.UI.createImageView({image:image2,height:290, width:240});
var iv3 = Ti.UI.createImageView({image:image3,height:290, width:240});

tableview.visible = false;
tableview2.visible = false;
tableview3.visible = false;

var scrollView = Ti.UI.createScrollableView({
	views:[iv1,iv2,iv3],
	showPagingControl:true,
	clipViews:false,
	top:10,
	left:30,
	right:30,
	height:330
});
win.add(scrollView);

iv1.addEventListener('singletap', function()
{
	showTableView();
});
iv2.addEventListener('singletap', function()
{
	showTableView();
});
iv3.addEventListener('singletap', function()
{
	showTableView();
});

function showTableView()
{
	tableview.visible=true;
	scrollView.visible=false;
	var t = Ti.UI.create2DMatrix();
	tableview.animate({transform:t,duration:100});

}


;