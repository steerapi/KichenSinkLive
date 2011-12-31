(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/table_view_perf.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "table_view_perf.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var w = Ti.UI.currentWindow;
var v = Ti.UI.createView();
var tv = Ti.UI.createTableView({
	top:0,
	height:280,
	borderWidth:1,
	borderColor:"black"
});
var l = Ti.UI.createLabel({
	text:"running",
	width:"auto",
	height:"auto",
	bottom:15
});
v.add(tv);
v.add(l);
w.add(v);

var count = 500;
var ts = new Date();

var data = [];

for (var c=0;c<count;c++)
{
	var row = Ti.UI.createTableViewRow({title:"Row "+(c+1)});
	data[c] = row;
}

tv.data = data;

var ts2 = new Date();
var duration = ts2.getTime() - ts.getTime();
var each = duration / count;
l.text = "Executed: "+count+" iterations\nTook: " + duration +" ms\n" + each.toFixed(2) + " ms/row";
