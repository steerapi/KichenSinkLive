(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/table_view_noscroll.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "table_view_noscroll.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var w = Ti.UI.currentWindow;
var search = Titanium.UI.createSearchBar({
	showCancel:false,
	hintText:'type in me then scroll'
});

var tv = Ti.UI.createTableView({
	scrollable:false,
	search:search
});
w.add(tv);

var data = [];
var count = 5;

for (var c=0;c<count;c++)
{
	var row = Ti.UI.createTableViewRow({title:"Row "+(c+1)});
	data[c] = row;
}

tv.data = data;

