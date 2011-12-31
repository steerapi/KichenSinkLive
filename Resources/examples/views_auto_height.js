setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/views_auto_height.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "views_auto_height.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
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
