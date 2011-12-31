(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_api_sections.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_api_sections.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------

var section1 = Ti.UI.createTableViewSection({
	headerTitle:'Header 1'
});
for (var i=0; i < 4; i++) {
	section1.add(Ti.UI.createTableViewRow({
		title:'Row '+i
	}));
}

var section2 = Ti.UI.createTableViewSection();
for (var i=4; i < 10; i++) {
	section2.add(Ti.UI.createTableViewRow({
		title:'Row '+i
	}));
}

var tv = Ti.UI.createTableView({
	data:[section1,section2]
});
Ti.UI.currentWindow.add(tv);