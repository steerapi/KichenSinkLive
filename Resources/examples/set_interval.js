(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/set_interval.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "set_interval.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;

var label = Ti.UI.createLabel({
	text:'Running...',
	font:{fontFamily:'Helvetica Neue',fontSize:24,fontWeight:'bold'},
	color:'#999',
	textAlign:'center',
	width:'auto',
	height:'auto'
});
win.add(label);
var count = 0;
setInterval(function()
{
	count++;
	label.text = "Interval fired " + count;
},10);

