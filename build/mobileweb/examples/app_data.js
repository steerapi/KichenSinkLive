(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/app_data.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "app_data.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var data = '';

data+= 'ID: ' + Ti.App.getID() + '\n';
data+= 'Name: ' + Ti.App.getName() + '\n';
data+= 'Version: ' + Ti.App.getVersion() + '\n';
data+= 'Publisher: ' + Ti.App.getPublisher() + '\n';
data+= 'URL: ' + Ti.App.getURL() + '\n';
data+= 'Description: ' + Ti.App.getDescription() + '\n';
data+= 'Copyright: ' + Ti.App.getCopyright() + '\n';
data+= 'GUID: ' + Ti.App.getGUID() + '\n';
data+= 'Path: ' + Ti.App.appURLToPath('index.html') + '\n';
data+= 'Build: ' + Ti.version + '.' + Ti.buildHash + ' (' + Ti.buildDate + ')\n';


var label = Ti.UI.createLabel({
	text:data,
	top:20,
	font:{fontFamily:'Helvetica Neue',fontSize:16,fontWeight:'bold'},
	textAlign:'left',
	width:'auto',
	height:'auto'
});
win.add(label);