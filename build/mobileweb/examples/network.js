(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/network.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "network.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var label = Ti.UI.createLabel({
	text:'type:' + Ti.Network.networkType + ' online:' + Ti.Network.online + ' name:'+Ti.Network.networkTypeName,
	font:{fontSize:14},
	color:'#777',
	top:10,
	left:10,
	width:'auto',
	height:'auto'
});
win.add(label);

var label2 = Ti.UI.createLabel({
	text:'Change Event: not fired',
	font:{fontSize:14},
	color:'#777',
	top:30,
	left:10,
	width:'auto',
	height:'auto'
});
win.add(label2);
Ti.Network.addEventListener('change', function(e)
{
	var type = e.networkType;
	var online = e.online;
	var networkTypeName = e.networkTypeName;
	label2.text = 'Change fired net type:' + type + ' online:' + online + ' name:'+networkTypeName;
});

;