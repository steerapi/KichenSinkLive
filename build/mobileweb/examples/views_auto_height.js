(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/views_auto_height.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "views_auto_height.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundColor = '#336699';

var commentTextWrap = Ti.UI.createView({ 
	backgroundColor: '#fff', 
	borderRadius: 12, 
	height: 'auto', 
	width: 300, 
	top: 10 
});

var commentText = Ti.UI.createLabel({ 
	text: "My containing view should only be as large as I am ", 
	font: {fontSize: 12}, 
	width: 280, 
	height:'auto', 
	top: 10 
});

commentTextWrap.add(commentText); 
win.add(commentTextWrap);