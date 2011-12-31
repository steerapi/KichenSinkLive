(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/custom_fonts.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "custom_fonts.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var label = Ti.UI.createLabel({
	text:"Appcelerator\nFTW!",
	font:{fontSize:54,fontFamily:"Comic Zine OT"},
	width:"auto",
	textAlign:"center"
});

win.add(label);