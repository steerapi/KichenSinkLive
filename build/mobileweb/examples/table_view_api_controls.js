(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_api_controls.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_api_controls.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [];
var ts1 = new Date().getTime();

function rightButtonClickHandler(e)
{
	Ti.API.info("button click on row. index = "+e.index+", row = "+e.source.row+", section = "+e.source.section+",rightButton = "+rightButton);
}

function rowClickHandler(e)
{
	Ti.API.info("row click on row. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);
}

function sectionClickHandler(e)
{
	Ti.API.info("row click on section. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);
}


for (var c=0;c<10;c++)
{
	data[c] = Ti.UI.createTableViewSection({headerTitle:'Group '+(c+1)});
	for (var x=0;x<40;x++)
	{
		var label = Ti.UI.createLabel({
			text:'Group '+(c+1)+', Row '+(x+1)+"\nThis is another line.\nCool",
			height:'auto',
			width:'auto',
			left:10
		});
		var rightButton = Ti.UI.createButton({
			style:Ti.UI.iPhone.SystemButton.INFO_DARK,
			right:10,
			row:x,
			section:c
		});
		rightButton.addEventListener('click',rightButtonClickHandler);
		var row = Ti.UI.createTableViewRow({height:'auto',className:'row'});
		row.add(label);
		row.add(rightButton);
		data[c].add(row);
		row.addEventListener('click',rowClickHandler);
	}
	data[c].addEventListener('click',sectionClickHandler);
}
var ts2 = new Date().getTime();

// create table view
var tableview = Ti.UI.createTableView({
	data:data,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	//rowHeight:80,
	minRowHeight:80
	//maxRowHeight:500,
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	Ti.API.info("row click on table view. index = "+e.index+", row = "+e.row+", section = "+e.section+", source="+e.source);

	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	Ti.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);


// this is simply a little window we show
// that displays the time it took to build the table and show it

var messageWin = Ti.UI.createWindow({
	height:30,
	width:200,
	bottom:70,
	borderRadius:10,
	touchEnabled:false,
	opacity:0,

	orientationModes : [
	Ti.UI.PORTRAIT,
	Ti.UI.UPSIDE_PORTRAIT,
	Ti.UI.LANDSCAPE_LEFT,
	Ti.UI.LANDSCAPE_RIGHT
	]
});

var messageView = Ti.UI.createView({
	height:30,
	width:200,
	borderRadius:10,
	backgroundColor:'#000',
	opacity:0.7,
	touchEnabled:false
});

var messageLabel = Ti.UI.createLabel({
	text:(ts2-ts1)+' ms',
	color:'#fff',
	width:200,
	height:'auto',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:13
	},
	textAlign:'center'
});
messageWin.add(messageView);
messageWin.add(messageLabel);
messageWin.open();
messageWin.animate({opacity:1,duration:800});

// close timer window after 4 seconds
setTimeout(function()
{
	messageWin.animate({opacity:0,duration:800},function()
	{
		messageWin.close();
		messageWin=null;
	});
},4000);

// make sure to close window if this window is closed
Ti.UI.currentWindow.addEventListener('close',function()
{
	if (messageWin)
	{
		messageWin.close();
	}
});