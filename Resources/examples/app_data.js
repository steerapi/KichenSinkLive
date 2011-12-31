(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/app_data.js");
  xhr = Titanium.Network.createHTTPClient();
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
var win = Titanium.UI.currentWindow;

var data = '';

data+= 'ID: ' + Titanium.App.getID() + '\n';
data+= 'Name: ' + Titanium.App.getName() + '\n';
data+= 'Version: ' + Titanium.App.getVersion() + '\n';
data+= 'Publisher: ' + Titanium.App.getPublisher() + '\n';
data+= 'URL: ' + Titanium.App.getURL() + '\n';
data+= 'Description: ' + Titanium.App.getDescription() + '\n';
data+= 'Copyright: ' + Titanium.App.getCopyright() + '\n';
data+= 'GUID: ' + Titanium.App.getGUID() + '\n';
data+= 'Path: ' + Titanium.App.appURLToPath('index.html') + '\n';
data+= 'Build: ' + Titanium.version + '.' + Titanium.buildHash + ' (' + Titanium.buildDate + ')\n';


var label = Titanium.UI.createLabel({
	text:data,
	top:20,
	font:{fontFamily:'Helvetica Neue',fontSize:16,fontWeight:'bold'},
	textAlign:'left',
	width:'auto',
	height:'auto'
});
win.add(label);
